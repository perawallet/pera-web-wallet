import {useEffect, useState} from "react";

import {useAppContext} from "../../app/AppContext";
import {appDBManager} from "../../app/db";

function useDBAccounts() {
  const {
    state: {masterkey}
  } = useAppContext();

  const [dbAccounts, setDBAccounts] = useState<AppDBScheme["accounts"] | undefined>();

  useEffect(() => {
    let ignore = false;

    if (!masterkey) return undefined;

    appDBManager
      .decryptTableEntries(
        "accounts",
        masterkey!
      )("address")
      .then((accounts) => {
        if (!ignore) setDBAccounts(accounts);
      });

    return () => {
      ignore = true;
    };
  }, [masterkey]);

  return dbAccounts;
}

export default useDBAccounts;
