import "./_account-import-backup-success.scss";

import checkmarkAnimation from "../../../../../core/ui/animation/Checkmark.json";

import Lottie from "lottie-react";
import {List, ListItem} from "@hipo/react-ui-toolkit";

import ROUTES from "../../../../../core/route/routes";
import LinkButton from "../../../../../component/button/LinkButton";
import AccountSuccessCard from "../../../success/card/AccountSuccessCard";
import useLocationWithState from "../../../../../core/util/hook/useLocationWithState";

type LocationState = {importedAccounts: AccountOverview[]};

function AccountImportBackupSuccess() {
  const {importedAccounts} = useLocationWithState<LocationState>();

  console.log({importedAccounts});

  return (
    <section className={"account-import-backup-success"}>
      <div className={"animation--slide-in animation--slide-in--delay--4"}>
        <Lottie
          animationData={checkmarkAnimation}
          loop={false}
          className={"account-import-backup-success__checkmark-animation"}
        />

        <header className={"account-import-backup-success__header"}>
          <h1 className={"typography--display text-color--main"}>
            {"Restore completed"}
          </h1>

          <LinkButton
            buttonType={"secondary"}
            size={"large"}
            to={ROUTES.OVERVIEW.ROUTE}
            customClassName={"account-import-backup-success__header-cta"}>
            {"Go to Accounts"}
          </LinkButton>
        </header>

        {!!importedAccounts?.length && (
          <p className={"account-import-backup-success__description"}>
            {`${importedAccounts.length} account${
              importedAccounts.length > 1 ? " s" : ""
            } were restored from backup file`}
          </p>
        )}
      </div>

      <List
        items={importedAccounts!}
        customClassName={"account-import-backup-success__list"}>
        {(account) => (
          <ListItem>
            <AccountSuccessCard account={account} />
          </ListItem>
        )}
      </List>
    </section>
  );
}

export default AccountImportBackupSuccess;
