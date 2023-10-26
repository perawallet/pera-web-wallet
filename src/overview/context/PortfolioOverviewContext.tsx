import {createContext, ReactNode, useContext} from "react";

import usePortfolioOverview from "../util/hook/usePortfolioOverview";

const PortfolioContext = createContext(
  undefined as unknown as ReturnType<typeof usePortfolioOverview>
);

PortfolioContext.displayName = "PortfolioContext";

export function PortfolioContextProvider({children}: {children: ReactNode}) {
  const portfolioOverview = usePortfolioOverview();

  return (
    <PortfolioContext.Provider value={portfolioOverview}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioContext() {
  const context = useContext(PortfolioContext);

  // password required routes except settings
  // display spinner until context is fetched
  return context!;
}
