import {useCallback, useEffect, useReducer, useRef} from "react";

import {peraApi} from "../../../core/util/pera/api/peraApi";
import HttpStatusCodes from "../../../core/network/httpStatusCodes";
import {useAppContext} from "../../../core/app/AppContext";
import useAsyncProcess from "../../../core/network/async-process/useAsyncProcess";
import {AccountASA} from "../../../core/util/pera/api/peraApiModels";
import {STORED_KEYS} from "../../../core/util/storage/web/webStorage";
import {encryptedWebStorageUtils} from "../../../core/util/storage/web/webStorageUtils";
import {assetDBManager} from "../../../core/app/db";

export type PortfolioOverview = Omit<AppDBOverview, "accounts"> & {
  accounts: (AccountOverview & {accountName?: string})[];
};

const defaultPortfolioContextState: PortfolioOverview = {
  current_round: "",
  portfolio_value_usd: "",
  portfolio_value_algo: "",
  accounts: []
};

function usePortfolioOverview(options?: {
  interval?: number;
}): PortfolioOverview | undefined {
  const {
    state: {accounts, preferredNetwork, masterkey}
  } = useAppContext();
  const preferredNetworkRef = useRef(preferredNetwork);
  const lastKnownPortfolioOverviewRef = useRef<PortfolioOverview | undefined>(
    Object.keys(accounts).length === 0 ? defaultPortfolioContextState : undefined
  );
  const {
    state: {data: walletAssetsDetail},
    runAsyncProcess: runFetchAssetDetailsAsyncProcess
  } = useAsyncProcess<AccountASA[]>();

  // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
  const [_, triggerUpdate] = useReducer((x) => x + 1, 0);

  // asset-details fetching on bg in case of overview change
  // set fetched asset-detail values in DB
  useEffect(() => {
    (async () => {
      if (walletAssetsDetail) {
        try {
          await assetDBManager.setAllAssets()(walletAssetsDetail);

          triggerUpdate();
        } catch (error) {
          console.error(error);
        }
      }
    })();
  }, [walletAssetsDetail]);

  const addNewlyCreatedUserAccounts = useCallback(
    (overviewData?: AppDBOverview) => {
      if (!overviewData) return undefined;

      return {
        ...overviewData,

        // add newly created but not activated accounts in block
        // these accounts not returned by BE
        accounts: Object.values(accounts).map((account) => {
          const foundAccount = overviewData?.accounts.find(
            (accountOverview) => accountOverview.address === account.address
          );

          if (foundAccount) {
            return {
              ...foundAccount,
              accountName: accounts[account.address]?.name || account.address
            };
          }

          return {
            address: account.address,
            accountName: account.name,
            name: null,
            collectible_count: 0,
            standard_asset_count: 1,
            total_algo_value: "0.00",
            total_usd_value: "0.00"
          };
        })
      };
    },
    [accounts]
  );

  const fetchLastKnownOverviewData = useCallback(
    async (fetchOptions?: {refresh?: boolean}) => {
      const isTabFocused = document.hasFocus();

      if (!masterkey || !isTabFocused || Object.keys(accounts).length <= 0) {
        return;
      }

      let shouldTriggerUpdate = fetchOptions?.refresh || false;
      let staleOverviewData = lastKnownPortfolioOverviewRef.current;
      let revalidatedOverviewData: PortfolioOverview | undefined;

      if (!staleOverviewData) {
        staleOverviewData = (await encryptedWebStorageUtils(masterkey).get(
          STORED_KEYS.STALE_PORTFOLIO_OVERVIEW
        )) as PortfolioOverview | undefined;

        // first render getting stale data
        shouldTriggerUpdate = true;
      }

      try {
        revalidatedOverviewData = await peraApi.getMultipleAccountOverview({
          account_addresses: Object.keys(accounts),
          last_known_round: fetchOptions?.refresh
            ? undefined
            : staleOverviewData?.current_round,
          exclude_opt_ins: true
        });

        // fetch asset details on bg
        runFetchAssetDetailsAsyncProcess(
          peraApi.getAllMultipleAccountAssets(
            revalidatedOverviewData.accounts.map((account) => account.address)
          )
        );

        // trigger update with new values
        shouldTriggerUpdate = true;
      } catch (error: any) {
        // if NOT_MODIFIED, return stale data
        if (error.statusCode !== HttpStatusCodes.NOT_MODIFIED) {
          // Internal Server Error
          console.error(error);
        }
      } finally {
        let overviewData = staleOverviewData;

        if (revalidatedOverviewData) {
          overviewData = revalidatedOverviewData;
        }

        const overviewDataWithNewAccounts = addNewlyCreatedUserAccounts(overviewData);

        if (overviewDataWithNewAccounts) {
          await encryptedWebStorageUtils(masterkey).set(
            STORED_KEYS.STALE_PORTFOLIO_OVERVIEW,
            overviewDataWithNewAccounts
          );

          lastKnownPortfolioOverviewRef.current = overviewDataWithNewAccounts;
        }

        if (shouldTriggerUpdate) {
          triggerUpdate();
        }
      }
    },
    [accounts, addNewlyCreatedUserAccounts, masterkey, runFetchAssetDetailsAsyncProcess]
  );

  // send initial request and set the timer for polling if interval is given
  useEffect(() => {
    let intervalId: NodeJS.Timer | undefined;

    fetchLastKnownOverviewData();

    if (options?.interval) {
      intervalId = setInterval(() => fetchLastKnownOverviewData(), options?.interval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchLastKnownOverviewData, options?.interval]);

  // fetch immediately cases
  // network changed or account added
  useEffect(() => {
    if (
      preferredNetworkRef.current !== preferredNetwork ||
      (lastKnownPortfolioOverviewRef.current &&
        Object.keys(accounts).length !==
          lastKnownPortfolioOverviewRef?.current.accounts.length)
    ) {
      fetchLastKnownOverviewData({refresh: true});

      preferredNetworkRef.current = preferredNetwork;
      lastKnownPortfolioOverviewRef.current = undefined;
    }
  }, [accounts, fetchLastKnownOverviewData, preferredNetwork]);

  return lastKnownPortfolioOverviewRef.current;
}

export default usePortfolioOverview;
