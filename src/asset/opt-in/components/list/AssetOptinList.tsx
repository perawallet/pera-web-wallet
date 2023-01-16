import React, {useEffect, useCallback, useRef} from "react";

import SearchableList from "../../../../component/list/searchable-list/SearchableList";
import useAsyncProcess from "../../../../core/network/async-process/useAsyncProcess";
import {filterTruthyObjectValues} from "../../../../core/util/object/objectUtils";
import {peraApi} from "../../../../core/util/pera/api/peraApi";
import AssetOptinListItem from "./item/AssetOptinListItem";
import {AccountASA} from "../../../../core/util/pera/api/peraApiModels";
import {generateKeyMapFromArray} from "../../../../core/util/array/arrayUtils";
import {useSimpleToaster} from "../../../../component/simple-toast/util/simpleToastHooks";
import {assetDBManager} from "../../../../core/app/db";

interface AssetOptinListProps {
  account: AppDBAccount;
}

function AssetOptinList({account}: AssetOptinListProps) {
  const accountAssetsRef = useRef<AccountASA[] | undefined>();
  const {
    state: {data: allAssets, isRequestPending, error},
    runAsyncProcess
  } = useAsyncProcess<ListRequestResponse<Asset>>();
  const simpleToaster = useSimpleToaster();

  const fetchAssets = useCallback(
    ({query}: {query: string}) => {
      runAsyncProcess(peraApi.getAssets(filterTruthyObjectValues({q: query})));
    },
    [runAsyncProcess]
  );

  useEffect(() => {
    (async () => {
      fetchAssets({query: ""});

      if (!accountAssetsRef.current) {
        const accountAssets = await assetDBManager.getAllByAccountAddress(
          account.address
        );

        accountAssetsRef.current = accountAssets;
      }
    })();
  }, [account.address, fetchAssets]);

  if (error) {
    simpleToaster.display({
      type: "error",
      message: "There is an error, please try again"
    });
  }

  return (
    <SearchableList
      shouldDisplaySpinner={isRequestPending}
      items={filterAssets()}
      typeaheadSearchProps={{
        name: "filterAssetQuery",
        initialValue: "",
        placeholder: "Search asset ID or name",
        onQueryChange: handleOnQueryChange,
        queryChangeDebounceTimeout: 300
      }}>
      {(asset) => <AssetOptinListItem asset={asset} account={account} />}
    </SearchableList>
  );

  function handleOnQueryChange(query: string) {
    fetchAssets({query});
  }

  function filterAssets() {
    const notOwnedAssets = [];

    if (allAssets) {
      if (accountAssetsRef.current?.length) {
        const ownedAssets: Record<string, AccountASA> = generateKeyMapFromArray(
          accountAssetsRef.current,
          "asset_id"
        );

        for (const asset of allAssets?.results) {
          if (asset.asset_id in ownedAssets === false) {
            notOwnedAssets.push(asset);
          }
        }
      } else {
        return allAssets.results;
      }
    }

    return notOwnedAssets;
  }
}

export default React.memo(AssetOptinList);
