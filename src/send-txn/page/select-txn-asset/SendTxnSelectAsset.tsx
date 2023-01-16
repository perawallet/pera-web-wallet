import "./_send-txn-select-asset.scss";

import {ReactComponent as PlusIcon} from "../../../core/ui/icons/plus.svg";

import {Navigate, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

import GoBackButton from "../../../component/go-back-button/GoBackButton";
import {useSendTxnFlowContext} from "../../context/SendTxnFlowContext";
import ROUTES from "../../../core/route/routes";
import useAsyncProcess from "../../../core/network/async-process/useAsyncProcess";
import {AccountASA} from "../../../core/util/pera/api/peraApiModels";
import SearchableList from "../../../component/list/searchable-list/SearchableList";
import SendTxnSelectAssetListItem from "./list-item/SendTxnSelectAssetListItem";
import InfoBox from "../../../component/info-box/InfoBox";
import Button from "../../../component/button/Button";
import MoonPayModal, {
  MOON_PAY_MODAL_ID
} from "../../../core/integrations/moon-pay/modal/MoonPayModal";
import {useModalDispatchContext} from "../../../component/modal/context/ModalContext";
import {assetDBManager} from "../../../core/app/db";

function SendTxnSelectAsset() {
  const navigate = useNavigate();
  const {
    formitoState: {senderAddress},
    dispatchFormitoAction
  } = useSendTxnFlowContext();
  const {
    state: {data: accountAssets, isRequestPending, isRequestFetched, error},
    runAsyncProcess
  } = useAsyncProcess<AccountASA[]>();
  const [queriedAssets, setQueriedAssets] = useState<AccountASA[] | undefined>();
  const assetsListItems = queriedAssets || accountAssets || [];
  const dispatchModalStateAction = useModalDispatchContext();

  useEffect(() => {
    if (!senderAddress) return;

    runAsyncProcess(assetDBManager.getAllByAccountAddress(senderAddress));
  }, [runAsyncProcess, senderAddress]);

  if (!senderAddress) {
    return <Navigate to={ROUTES.SEND_TXN.ROUTE} />;
  }

  return (
    <div className={"send-txn__select-asset"}>
      <GoBackButton
        text={"Select Asset"}
        customClassName={"send-txn__select-asset__go-back-button"}
      />

      {error && (
        <InfoBox
          title={"Unexpected error"}
          infoText={"There is an error getting assets, please try again later."}
        />
      )}

      {filterZeroValuedAssetListItems(assetsListItems).length > 0 && (
        <SearchableList
          customClassName={"send-txn-asset__list"}
          shouldDisplaySpinner={isRequestPending}
          items={filterZeroValuedAssetListItems(assetsListItems)}
          typeaheadSearchProps={{
            customClassName: "send-txn-asset__filter-input",
            name: "filterAccountQuery",
            placeholder: "Search Asset",
            onQueryChange: handleFilterAsset,
            queryChangeDebounceTimeout: 300
          }}>
          {(asset) => (
            <SendTxnSelectAssetListItem
              asset={asset}
              onSelect={handleOnSelectAsset(asset)}
            />
          )}
        </SearchableList>
      )}

      {isRequestFetched && assetsListItems.length === 0 && (
        <div className={"send-txn-asset__fund"}>
          <p className={"typography--subhead  text-color--gray"}>
            {"You have no funds in this account"}
          </p>

          <Button
            size={"large"}
            onClick={handleAddFundsClick}
            customClassName={"send-txn-asset__fund-cta"}>
            <PlusIcon width={20} height={20} />

            <span>{"Add Funds"}</span>
          </Button>
        </div>
      )}
    </div>
  );

  function handleFilterAsset(value: string) {
    const query = value.toLowerCase();

    const queriedAssetsData =
      accountAssets?.filter(
        (asset) =>
          asset.name.toLowerCase().includes(query) ||
          asset.unit_name.toLowerCase().includes(query)
      ) || [];

    setQueriedAssets(queriedAssetsData);
  }

  function filterZeroValuedAssetListItems(assets: AccountASA[]) {
    return assets.filter((asset) => asset.amount !== "0");
  }

  function handleOnSelectAsset(asset: AccountASA) {
    return () => {
      dispatchFormitoAction({
        type: "SET_FORM_VALUE",
        payload: {
          selectedAsset: asset,
          txnAmount: ""
        }
      });

      navigate(ROUTES.SEND_TXN.ROUTE);
    };
  }

  function handleAddFundsClick() {
    dispatchModalStateAction({
      type: "OPEN_MODAL",
      payload: {
        item: {
          id: MOON_PAY_MODAL_ID,
          modalContentLabel: "Add funds via MoonPay",
          customClassName: "moon-pay-modal-container",
          children: (
            <MoonPayModal address={senderAddress!} onClose={handleCloseMoonPayModal} />
          )
        }
      }
    });
  }

  function handleCloseMoonPayModal() {
    dispatchModalStateAction({
      type: "CLOSE_MODAL",
      payload: {
        id: MOON_PAY_MODAL_ID
      }
    });

    navigate(ROUTES.SEND_TXN.ROUTE, {
      state: {address: senderAddress}
    });
  }
}

export default SendTxnSelectAsset;
