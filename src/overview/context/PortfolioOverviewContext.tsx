import {createContext, ReactNode, useContext} from "react";

import usePortfolioOverview, {PortfolioOverview} from "../util/hook/usePortfolioOverview";
import {SECOND_IN_MS} from "../../core/util/time/timeConstants";

const PortfolioContext = createContext(undefined as PortfolioOverview | undefined);

PortfolioContext.displayName = "PortfolioContext";

// eslint-disable-next-line no-magic-numbers
const PORTFOLIO_OVERVIEW_POLLING_INTERVAL = SECOND_IN_MS * 3.5;

export function PortfolioContextProvider({children}: {children: ReactNode}) {
  const portfolioOverview = usePortfolioOverview({
    interval: PORTFOLIO_OVERVIEW_POLLING_INTERVAL
  });

  return (
    <PortfolioContext.Provider value={portfolioOverview}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioContext() {
  const context = useContext(PortfolioContext);

  return context;
}
