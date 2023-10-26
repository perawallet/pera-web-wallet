import Transport from "@ledgerhq/hw-transport";
import {useEffect, useState} from "react";

import {
  getLedgerAccountDetails,
  LedgerAccountDetails
} from "../../../account/page/import/ledger/accountImportLedgerUtils";
import {usePortfolioContext} from "../../../overview/context/PortfolioOverviewContext";
import {getPortfolioOverviewData} from "../../../overview/util/portfolioOverviewUtils";
import {useAppContext} from "../../app/AppContext";
import {INITIAL_ASYNC_PROCESS_STATE} from "../../network/async-process/asyncProcessConstants";
import {generateKeyMapFromArray} from "../array/arrayUtils";

type LedgerAccountsOverviewAsyncState = Omit<
  AsyncProcessState<(AccountOverview & LedgerAccountDetails)[]>,
  "requestPayload"
>;

function useLedgerAccounts(
  connection: Transport,
  {
    startIndex,
    batchSize
  }: {
    startIndex: number;
    batchSize: number;
  }
) {
  const [ledgerAccountDetails, setLedgerAccountDetails] = useState<
    LedgerAccountDetails[] | undefined
  >();
  const [ledgerAccountsOverviewAsyncState, setLedgerAccountsOverviewAsyncState] =
    useState<LedgerAccountsOverviewAsyncState>(INITIAL_ASYNC_PROCESS_STATE);
  const {
    state: {algoPrice}
  } = useAppContext();
  const {accounts = {}} = usePortfolioContext() || {};

  useEffect(() => {
    getLedgerAccounts();

    async function getLedgerAccounts() {
      // eslint-disable-next-line no-underscore-dangle
      if (connection._appAPIlock) return;

      try {
        setLedgerAccountsOverviewAsyncState((oldState) => ({
          ...oldState,
          isRequestPending: true
        }));

        const ledgerAccounts = await getLedgerAccountDetails(connection, {
          startIndex,
          batchSize
        });

        setLedgerAccountDetails((oldLedgerAccountDetails) => [
          ...(oldLedgerAccountDetails || []),
          ...ledgerAccounts
        ]);
      } catch (error: any) {
        console.error(error);
      }
    }
  }, [batchSize, connection, startIndex]);

  useEffect(() => {
    if (!ledgerAccountDetails || !algoPrice) return;

    const abortController = new AbortController();

    const getMultipleLedgerAccountOverview = async () => {
      try {
        const accountsToBeFetched = ledgerAccountDetails!.slice(batchSize * -1);

        const portfolioOverview = await getPortfolioOverviewData({
          addresses: accountsToBeFetched.map((account) => account.address),
          algoPrice,
          abortSignal: abortController.signal,
          accounts
        });

        const ledgerAccountDetailsKeyMap: Record<string, LedgerAccountDetails> =
          generateKeyMapFromArray(ledgerAccountDetails, "address");

        setLedgerAccountsOverviewAsyncState((oldState) => {
          const data = [
            ...(oldState.data || []),
            ...Object.values(portfolioOverview.accounts).map((account) => ({
              ...account,
              accountType: "ledger" as AccountType,
              ...ledgerAccountDetailsKeyMap[account.address]
            }))
          ];

          return {
            ...oldState,
            isRequestPending: false,
            isRequestFetched: true,
            data
          };
        });
      } catch (error: any) {
        console.error(error);

        setLedgerAccountsOverviewAsyncState({
          isRequestPending: false,
          isRequestFetched: true,
          data: null,
          error
        });
      }
    };

    getMultipleLedgerAccountOverview();

    // eslint-disable-next-line consistent-return
    return () => abortController.abort();
  }, [batchSize, ledgerAccountDetails, algoPrice, accounts]);

  return ledgerAccountsOverviewAsyncState;
}

export default useLedgerAccounts;
