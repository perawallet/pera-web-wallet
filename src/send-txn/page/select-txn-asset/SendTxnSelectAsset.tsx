import "./_send-txn-select-asset.scss";

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
import {assetDBManager} from "../../../core/app/db";
import AddFundsButton from "../../../add-funds/button/AddFundsButton";

function SendTxnSelectAsset() {
  const navigate = useNavigate();
  const {
    formitoState: {senderAddress},
    dispatchFormitoAction
  } = useSendTxnFlowContext();
  const {
    state: {data: accountAssets, isRequestPending, error},
    runAsyncProcess
  } = useAsyncProcess<AccountASA[]>();
  const [queriedAssets, setQueriedAssets] = useState<AccountASA[] | undefined>();
  const assetsListItems = filterZeroValuedAssetListItems(
    queriedAssets || accountAssets || []
  );

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

      {assetsListItems && assetsListItems.length > 0 ? (
        <SearchableList
          customClassName={"send-txn-asset__list"}
          shouldDisplaySpinner={isRequestPending}
          items={assetsListItems}
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
      ) : (
        <div className={"send-txn-asset__fund"}>
          <p className={"typography--subhead  text-color--gray"}>
            {"You have no funds in this account"}
          </p>

          <AddFundsButton
            customClassName={"send-txn-asset__fund-cta"}
            size={"large"}
            accountAddress={senderAddress}
          />
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
}

export default SendTxnSelectAsset;
