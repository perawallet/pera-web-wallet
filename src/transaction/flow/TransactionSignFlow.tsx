import classNames from "classnames";
import {useCallback} from "react";
import {Route, Routes, useSearchParams} from "react-router-dom";

import Page from "../../component/page/Page";
import PeraConnectBanner from "../../component/pera-connect-banner/PeraConnectBanner";
import {useAppContext} from "../../core/app/AppContext";
import PasswordAccessPage from "../../password/page/access/PasswordAccessPage";
import {useTransactionSignFlowContext} from "../context/TransactionSignFlowContext";
import TransactionSignEmbeddedView from "../view/embedded/TransactionSignEmbeddedView";
import TransactionSignTabView from "../view/tab/TransactionSignTabView";

function TransactionSignFlow() {
  const [searchParams] = useSearchParams();
  const isEmbedded = Boolean(searchParams.get("embedded"));
  const isCompactMode = searchParams.get("compactMode") === "true";
  const {formitoState} = useTransactionSignFlowContext();
  const {
    state: {masterkey}
  } = useAppContext();

  const txnSignFlowPasswordGuard = useCallback(() => {
    if (!masterkey) {
      return isEmbedded ? (
        <div className={"align-center--horizontally transaction-sign-embedded-view"}>
          <PasswordAccessPage
            type={isCompactMode ? "embedded" : "connect-new-tab"}
            isCompactMode={isCompactMode}
          />
        </div>
      ) : (
        <div
          className={"transaction-sign-tab-view transaction-sign-tab-view__access-page"}>
          <PasswordAccessPage type={"connect-new-tab"} />
        </div>
      );
    }

    return isEmbedded ? <TransactionSignEmbeddedView /> : <TransactionSignTabView />;
  }, [isEmbedded, masterkey, isCompactMode]);

  return (
    <Routes>
      <Route
        element={
          <Page
            customClassName={classNames({
              "page--without-header": isEmbedded,
              "page--with-pera-connect-banner": !isEmbedded
            })}
            title={"Sign Transaction"}
            customBanner={
              <>
                {!isEmbedded && (
                  <PeraConnectBanner currentSession={formitoState.currentSession!} />
                )}
              </>
            }
          />
        }>
        <Route path={"/"} element={txnSignFlowPasswordGuard()} />
      </Route>
    </Routes>
  );
}

export default TransactionSignFlow;
