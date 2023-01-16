import classNames from "classnames";
import {Route, Routes, useSearchParams} from "react-router-dom";

import Page from "../../component/page/Page";
import PeraConnectBanner from "../../component/pera-connect-banner/PeraConnectBanner";
import {useConnectFlowContext} from "../context/ConnectFlowContext";
import ConnectPageEmbeddedView from "../view/embedded/ConnectPageEmbeddedView";
import ConnectPageTabView from "../view/tab/ConnectPageTabView";

function ConnectFlow() {
  const [searchParams] = useSearchParams();
  const {formitoState} = useConnectFlowContext();
  const isEmbedded = Boolean(searchParams.get("embedded"));

  return (
    <Routes>
      <Route
        element={
          <Page
            title={"Connect"}
            customClassName={classNames({
              "page--without-header": isEmbedded,
              "page--with-banner": !isEmbedded
            })}
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
          element={isEmbedded ? <ConnectPageEmbeddedView /> : <ConnectPageTabView />}
        />
      </Route>
    </Routes>
  );
}

export default ConnectFlow;
