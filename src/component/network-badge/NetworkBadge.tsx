import {useAppContext} from "../../core/app/AppContext";
import "./_network-badge.scss";

function NetworkBadge() {
  const {
    state: {preferredNetwork}
  } = useAppContext();

  if (preferredNetwork !== "testnet") {
    return null;
  }

  return <div className={"network-badge typography--tagline"}>{"TESTNET"}</div>;
}

export default NetworkBadge;
