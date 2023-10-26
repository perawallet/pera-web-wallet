/* eslint-disable max-lines */
import algosdk, {
  AssetTransferTxn,
  MustHaveSuggestedParams,
  PaymentTxn,
  SuggestedParams,
  Transaction
} from "algosdk";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import BluetoothTransport from "@ledgerhq/hw-transport-web-ble";
import AppAlgorand from "@ledgerhq/hw-app-algorand";
import {
  DeviceShouldStayInApp,
  TransportOpenUserCancelled,
  UserRefusedOnDevice
} from "@ledgerhq/errors";
import nacl from "tweetnacl";
import {useEffect, useState} from "react";
import {useToaster} from "@hipo/react-ui-toolkit";

import {ALGORAND_DEFAULT_TXN_WAIT_ROUNDS} from "../../../send-txn/util/sendTxnConstants";
import {useAppContext} from "../../app/AppContext";
import algod from "../algod/algod";
import {uint8ArrayToHex} from "../blob/blobUtils";
import {decryptSK} from "../nacl/naclUtils";
import {
  generateLedgerToastErrorMessage,
  getLedgerAccountDetails
} from "../../../account/page/import/ledger/accountImportLedgerUtils";
import PeraToast from "../../../component/pera-toast/PeraToast";
import {HALF_MINUTE_IN_MS, MINUTE_IN_MS} from "../time/timeConstants";
import {encodeString} from "../string/stringUtils";
import {getAccountType} from "../../../account/util/accountUtils";
import {ArbitraryData} from "../model/peraWalletModel";
import {appDBManager} from "../../app/db";

const SIGN_LEDGER_TXN_REVIEW_INFO_TOAST_ID = "sign-ledger-txn-review-info-toast-id";
const SIGN_LEDGER_TXN_SEND_INFO_TOAST_ID = "sign-ledger-txn-send-info-toast-id";
const SIGN_NO_AUTH_TXN_INFO_TOAST_ID = "sign-no-auth-txn-info-toast-id";
const SIGN_LEDGER_TIMEOUT = HALF_MINUTE_IN_MS;

function useTxnSigner() {
  const {
    state: {masterkey}
  } = useAppContext();
  const [suggestedParams, setSuggestedParams] = useState<SuggestedParams>();
  const toaster = useToaster();

  useEffect(() => {
    let ignore = false;

    algod.client
      .getTransactionParams()
      .do()
      .then((params) => {
        if (!ignore) setSuggestedParams(params);
      });

    return () => {
      ignore = true;
    };
  }, []);

  if (!suggestedParams || !masterkey) return undefined;

  return {
    _arbitraryData: undefined as ArbitraryData[] | undefined,
    _signedArbitraryData: undefined as ArbitraryData[] | undefined,
    _transaction: undefined as Transaction | undefined,
    _signedTransaction: undefined as Uint8Array | undefined,

    async sign(address: string, options: {sendNetwork: boolean}) {
      if (!this._transaction && !this._arbitraryData)
        throw Error("There is no txn to sign.");

      const [accountsData, accountDetail] = await Promise.all([
        appDBManager.decryptTableEntries("accounts", masterkey)("address"),
        algod.client.accountInformation(address).do() as Promise<AlgodAccountInformation>
      ]);
      const account = accountsData[address];
      const signerAccount = accountDetail["auth-addr"]
        ? accountsData[accountDetail["auth-addr"]] || {} // could be no auth account
        : account;

      let signedTxn: Uint8Array;

      const signerAccountType = getAccountType(signerAccount);

      if (signerAccountType === "standard" && !signerAccount.pk) {
        throw new Error("Account secret key is not found in the wallet");
      }

      if (signerAccountType === "watch") {
        let noAuthAccountToastMessage = {
          title: "Watch Account Signature",
          detail: "You cannot sign transactions with Watch Accounts."
        };

        if (accountDetail["auth-addr"]) {
          noAuthAccountToastMessage = {
            title: "Missing Auth Account",
            detail:
              "You cannot sign with this rekeyed account as you do not have its authorized account in your wallet."
          };
        }

        toaster.display({
          id: SIGN_NO_AUTH_TXN_INFO_TOAST_ID,
          timeout: HALF_MINUTE_IN_MS,
          render() {
            return (
              <PeraToast
                type={"warning"}
                title={noAuthAccountToastMessage.title}
                detail={noAuthAccountToastMessage.detail}
              />
            );
          }
        });

        throw Error("No Auth Account");
      }

      if (this._transaction) {
        if (signerAccountType === "ledger") {
          try {
            signedTxn = await signLedgerTxn({
              account: signerAccount,
              txn: this._transaction
            });
          } catch (error) {
            handleLedgerErrorState(error);

            throw error;
          }
        } else {
          signedTxn = await signStandardTxn({
            txn: this._transaction,
            pk: signerAccount.pk!
          });
        }

        this._signedTransaction = signedTxn;

        if (options.sendNetwork) await this.sendNetwork();
      }

      if (this._arbitraryData) {
        if (signerAccountType === "ledger") {
          // ledger does not support arbitrary data signing yet

          throw Error("Ledger data sign error");
        } else {
          this._signedArbitraryData = await signStandardArbitraryData({
            arbitraryData: this._arbitraryData,
            pk: signerAccount.pk!
          });
        }
      }

      const signData = {
        txn: this._transaction,
        signedTxn: this._signedTransaction,
        arbitraryData: this._arbitraryData,
        signedArbitraryData: this._signedArbitraryData
      };

      return signData;
    },

    reset() {
      this._arbitraryData = undefined;
      this._transaction = undefined;
      this._signedTransaction = undefined;
    },

    getSuggestedFee() {
      return suggestedParams.fee;
    },

    rawTxn(txnToSign: Transaction) {
      this._transaction = txnToSign;

      return this;
    },

    arbitraryDataTxn({data}: {data: ArbitraryData[]}) {
      this._arbitraryData = data;

      return this;
    },

    async sendNetwork() {
      if (!this._signedTransaction) throw Error("There is no signed txn.");

      toaster.display({
        id: SIGN_LEDGER_TXN_SEND_INFO_TOAST_ID,
        timeout: MINUTE_IN_MS,
        render() {
          return (
            <PeraToast
              type={"warning"}
              title={"Sending Transaction"}
              detail={"Please wait until your transaction confirmed."}
            />
          );
        }
      });

      await algod.client.sendRawTransaction(this._signedTransaction).do();

      await algosdk.waitForConfirmation(
        algod.client,
        this._transaction!.txID(),
        ALGORAND_DEFAULT_TXN_WAIT_ROUNDS
      );

      toaster.hide(SIGN_LEDGER_TXN_SEND_INFO_TOAST_ID);
    },

    paymentTxn({
      from,
      to,
      amount,
      note
    }: Omit<MustHaveSuggestedParams<PaymentTxn>, "suggestedParams" | "note"> & {
      note?: string;
    }) {
      this._transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        suggestedParams,
        from,
        to,
        amount,
        ...(note && {note: encodeString(note)})
      });

      return this;
    },

    assetTransferTxn({
      from,
      to,
      amount,
      assetIndex,
      note
    }: Omit<MustHaveSuggestedParams<AssetTransferTxn>, "suggestedParams" | "note"> & {
      note?: string;
    }) {
      this._transaction = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        suggestedParams,
        from,
        to,
        assetIndex,
        amount,
        ...(note && {note: encodeString(note)})
      });

      return this;
    },

    optInTxn({
      address,
      assetIndex
    }: {
      address: string;
    } & Pick<MustHaveSuggestedParams<AssetTransferTxn>, "assetIndex">) {
      this._transaction = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        suggestedParams,
        from: address,
        to: address,
        amount: 0,
        assetIndex
      });

      return this;
    },

    optOutTxn({
      address,
      assetIndex,
      closeRemainderTo
    }: {
      address: string;
    } & Required<
      Pick<MustHaveSuggestedParams<AssetTransferTxn>, "assetIndex" | "closeRemainderTo">
    >) {
      this._transaction = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        suggestedParams,
        from: address,
        to: address,
        amount: 0,
        assetIndex,
        closeRemainderTo
      });

      return this;
    },

    rekeyTxn({
      address,
      rekeyTo
    }: {
      address: string;
      rekeyTo: Required<MustHaveSuggestedParams<PaymentTxn>["reKeyTo"]>;
    }) {
      this._transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        suggestedParams,
        from: address,
        to: address,
        amount: 0,
        rekeyTo
      });

      return this;
    }
  };

  function signLedgerTxn({
    account,
    txn
  }: {
    account: AppDBAccount;
    txn: Transaction;
    // ledger firmware doesn't support arbitrary data signing yet
    // txn: Transaction | ArbitraryData[];
  }): Promise<Uint8Array> {
    const LedgerConnection = account.usbOnly ? TransportWebHID : BluetoothTransport;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => handleLedgerErrorState(new TransportOpenUserCancelled()),
        SIGN_LEDGER_TIMEOUT
      );
      const {unsubscribe} = LedgerConnection.listen({
        next: async (event) => {
          if ((event.type as "add" | "remove") === "add") {
            try {
              const connection =
                account.usbOnly && event.descriptor.opened
                  ? new TransportWebHID(event.descriptor)
                  : await LedgerConnection.open(event.descriptor);

              connection.on("disconnect", () => {
                reject(new DeviceShouldStayInApp());
              });

              // to catch locked and algorand app errors
              await getLedgerAccountDetails(connection, {startIndex: 0, batchSize: 1});

              const appAlgorand = new AppAlgorand(connection!);

              toaster.display({
                id: SIGN_LEDGER_TXN_REVIEW_INFO_TOAST_ID,
                timeout: MINUTE_IN_MS,
                render() {
                  return (
                    <PeraToast
                      type={"warning"}
                      title={"Review Transaction"}
                      detail={"Review your transaction on ledger."}
                    />
                  );
                }
              });

              const {signature} = await appAlgorand.sign(
                account.bip32!,
                uint8ArrayToHex(txn.toByte())
              );

              if (!signature || signature.length < nacl.sign.signatureLength)
                throw new UserRefusedOnDevice();

              resolve(
                txn.attachSignature(
                  account.address,
                  signature!.slice(0, nacl.sign.signatureLength)
                )
              );
            } catch (error: any) {
              handleLedgerErrorState(error);

              reject();
            } finally {
              toaster.hide(SIGN_LEDGER_TXN_REVIEW_INFO_TOAST_ID);
            }
          }
        },
        error: reject,
        complete: () => {
          unsubscribe();

          clearTimeout(timeout);
        }
      });
    });
  }

  async function signStandardTxn({txn, pk}: {txn: Transaction; pk: string}) {
    const sk = await decryptSK(pk, masterkey!);

    return txn.signTxn(sk!);
  }

  async function signStandardArbitraryData({
    arbitraryData,
    pk
  }: {
    arbitraryData: ArbitraryData[];
    pk: string;
  }) {
    const sk = await decryptSK(pk, masterkey!);

    return arbitraryData.map((data) => ({
      data: algosdk.signBytes(data.data, sk),
      message: data.message
    }));
  }

  function handleLedgerErrorState(error: unknown) {
    const {title, detail} = generateLedgerToastErrorMessage(error);

    toaster.display({
      id: title,
      render() {
        return <PeraToast type={"info"} title={title} detail={detail} />;
      }
    });
  }
}

export default useTxnSigner;
