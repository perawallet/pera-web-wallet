import {useCallback, useEffect, useRef, useState} from "react";

import {peraApi} from "../../../core/util/pera/api/peraApi";
import {useAppContext} from "../../../core/app/AppContext";
import useInterval from "../../../core/util/hook/useInterval";
import {
  getPortfolioOverviewData,
  mapNewlyCreatedUserAccounts
} from "../portfolioOverviewUtils";
import {SECOND_IN_MS} from "../../../core/util/time/timeConstants";
import {appDBManager} from "../../../core/app/db";

// eslint-disable-next-line no-magic-numbers
const PORTFOLIO_OVERVIEW_POLLING_INTERVAL = SECOND_IN_MS * 3.5;

function usePortfolioOverview() {
  const {
    state: {preferredNetwork, masterkey, algoPrice, hasAccounts},
    dispatch: dispatchAppState
  } = useAppContext();
  const preferredNetworkRef = useRef(preferredNetwork);
  const isLoadingRef = useRef(false);
  const isLockedApp = useRef(false);
  const [overview, setOverview] = useState<PortfolioOverview | undefined>();

  useEffect(() => {
    // reset overview data when network changing
    if (preferredNetworkRef.current !== preferredNetwork || !masterkey) {
      setOverview(undefined);
    }
  }, [preferredNetwork, masterkey]);

  const poll = useCallback(async () => {
    const isTabFocused = document.hasFocus();
    const abortController = new AbortController();

    isLockedApp.current = !masterkey;

    if (!masterkey || (!isTabFocused && overview) || !algoPrice || isLoadingRef.current) {
      return;
    }

    if (!hasAccounts) {
      if (!overview) {
        setOverview({
          portfolio_value_usd: "0.00",
          portfolio_value_algo: "0.00",
          accounts: {},
          current_round: null
        });
      }

      return;
    }

    try {
      isLoadingRef.current = true;

      const accounts = await appDBManager.decryptTableEntries(
        "accounts",
        masterkey!
      )("address");

      // network toggled
      // account added/removed
      // app is unlocked
      const forceRefresh =
        preferredNetworkRef.current !== preferredNetwork ||
        isLockedApp.current ||
        (overview &&
          Object.keys(accounts).length !== Object.keys(overview?.accounts).length);

      const shouldRefresh = await peraApi.getShouldRefresh(
        {
          account_addresses: Object.keys(accounts),
          last_refreshed_round: forceRefresh ? null : overview?.current_round || null
        },
        {signal: abortController.signal}
      );

      if (shouldRefresh.refresh) {
        const overviewData = await getPortfolioOverviewData({
          algoPrice,
          addresses: Object.keys(accounts),
          shouldRefresh,
          abortSignal: abortController.signal,
          accounts
        });

        const mappedOverview = mapNewlyCreatedUserAccounts({
          accounts,
          overview: overviewData
        });

        setOverview(mappedOverview);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      isLoadingRef.current = false;
      isLockedApp.current = false;
      preferredNetworkRef.current = preferredNetwork;
    }

    abortController.abort();
  }, [algoPrice, hasAccounts, masterkey, overview, preferredNetwork]);

  useInterval(poll, PORTFOLIO_OVERVIEW_POLLING_INTERVAL, {
    shouldRunCallbackAtStart: true
  });

  if (!overview) return undefined;

  const {accounts, ...portfolioValues} = overview;

  return {
    overview: portfolioValues,
    accounts,
    addAccounts,
    renameAccount,
    deleteAccount,
    refetchAccounts
  };

  async function addAccounts(addedAccounts: Record<string, AccountOverview>) {
    if (Object.keys(addedAccounts).length < 0) return;

    const newAccounts = {...overview!.accounts};

    // eslint-disable-next-line guard-for-in
    for (const address in addedAccounts) {
      const {
        name = address,
        date = new Date(),
        bip32,
        usbOnly,
        pk
      } = addedAccounts[address];

      const appDBAccount: AppDBAccount = {
        name,
        address,
        date,

        ...(bip32 && {bip32, usbOnly}),
        ...(pk && {pk})
      };

      await appDBManager.set("accounts", masterkey!)(address, appDBAccount);

      newAccounts[address] = addedAccounts[address];
    }

    if (overview) {
      setOverview({
        ...overview,
        accounts: newAccounts
      });
    }
  }

  async function renameAccount(address: string, name: string) {
    if (!overview) return;

    const {[address]: renamedAccount} = overview.accounts;

    await appDBManager.set("accounts", masterkey!)(address, {...renamedAccount, name});

    setOverview({
      ...overview,
      accounts: {...overview.accounts, [address]: {...renamedAccount, name}}
    });
  }

  async function deleteAccount(address: string) {
    if (!overview) return;

    await appDBManager.delete("accounts")({key: address, encryptionKey: masterkey!});

    const {[address]: renamedAccount, ...otherAccounts} = overview.accounts;

    if (Object.keys(otherAccounts).length === 0) {
      dispatchAppState({type: "SET_HAS_ACCOUNTS", hasAccounts: false});
    }

    setOverview({...overview, accounts: otherAccounts});
  }

  function refetchAccounts() {
    setOverview(undefined);
  }
}

export default usePortfolioOverview;
