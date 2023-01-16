import classNames from "classnames";
import {Route, Routes, useSearchParams} from "react-router-dom";

import Page from "../../component/page/Page";
import PeraConnectBanner from "../../component/pera-connect-banner/PeraConnectBanner";
import {useTransactionSignFlowContext} from "../context/TransactionSignFlowContext";
import TransactionSignEmbeddedView from "../view/embedded/TransactionSignEmbeddedView";
import TransactionSignTabView from "../view/tab/TransactionSignTabView";

function TransactionSignFlow() {
  const [searchParams] = useSearchParams();
  const isEmbedded = Boolean(searchParams.get("embedded"));
  const {formitoState} = useTransactionSignFlowContext();

  return (
    <Routes>
      <Route
        element={
          <Page
            customClassName={classNames({
              "page--without-header": isEmbedded,
              "page--with-banner": !isEmbedded
            })}
            title={"Sign Transaction"}
            banner={
              <>
                {!isEmbedded && (
                  <PeraConnectBanner currentSession={formitoState.currentSession!} />
                )}
              </>
            }
          />
        }>
        <Route
          path={"/"}
          element={
            isEmbedded ? <TransactionSignEmbeddedView /> : <TransactionSignTabView />
          }
        />
      </Route>
    </Routes>
  );
}

export default TransactionSignFlow;
