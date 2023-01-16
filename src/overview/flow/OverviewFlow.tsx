import {Routes, Route} from "react-router-dom";

import AccountOverview from "../page/overview/AccountOverview";

function OverviewFlow() {
  return (
    <Routes>
      <Route path={"/"} element={<AccountOverview />} />
    </Routes>
  );
}

export default OverviewFlow;
