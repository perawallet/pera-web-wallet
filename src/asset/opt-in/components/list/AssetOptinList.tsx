import {useEffect, useCallback, memo} from "react";

import SearchableList from "../../../../component/list/searchable-list/SearchableList";
import useAsyncProcess from "../../../../core/network/async-process/useAsyncProcess";
import {filterTruthyObjectValues} from "../../../../core/util/object/objectUtils";
import {peraApi} from "../../../../core/util/pera/api/peraApi";
import AssetOptinListItem from "./item/AssetOptinListItem";
import {AccountASA} from "../../../../core/util/pera/api/peraApiModels";
import {useSimpleToaster} from "../../../../component/simple-toast/util/simpleToastHooks";
import {assetDBManager} from "../../../../core/app/db";
import useTxnSigner from "../../../../core/util/hook/useTxnSigner";
import {generateKeyMapFromArray} from "../../../../core/util/array/arrayUtils";

function AssetOptinList({address}: {address: string}) {
  const {
    state: {data: assetsList, isRequestPending, error},
    runAsyncProcess
  } = useAsyncProcess<Asset[]>();
  const simpleToaster = useSimpleToaster();
  const signer = useTxnSigner();

  const fetchAssets = useCallback(
    (query: string) => {
      const abortController = new AbortController();

      runAsyncProcess(
        peraApi
          .getAssets(filterTruthyObjectValues({q: query}), {
            signal: abortController.signal
          })
          .then(async (listResponse) => {
            const accountAssets = await assetDBManager.getAllByAccountAddress(address);

            const ownedAssets: Record<string, AccountASA> = generateKeyMapFromArray(
              accountAssets,
              "asset_id"
            );

            return listResponse.results.filter(
              (asset) => asset.asset_id in ownedAssets === false
            );
          })
      );

      return () => abortController.abort();
    },
    [address, runAsyncProcess]
  );

  useEffect(() => {
    const abort = fetchAssets("");

    return () => {
      if (abort) abort();
    };
  }, [fetchAssets]);

  if (error) {
    simpleToaster.display({
      type: "error",
      message: "There is an error, please try again"
    });
  }

  return (
    <SearchableList
      shouldDisplaySpinner={isRequestPending}
      items={assetsList || []}
      typeaheadSearchProps={{
        name: "filterAssetQuery",
        initialValue: "",
        placeholder: "Search asset ID or name",
        onQueryChange: fetchAssets,
        queryChangeDebounceTimeout: 300
      }}>
      {(asset) => <AssetOptinListItem asset={asset} address={address} signer={signer} />}
    </SearchableList>
  );
}

export default memo(AssetOptinList);
