import {ReactComponent as UnlinkIcon} from "../../../core/ui/icons/unlink.svg";

import {List, ListItem, useToaster} from "@hipo/react-ui-toolkit";

import "./_pera-connect-session.scss";
import {useAppContext} from "../../../core/app/AppContext";
import {formatPeraConnectSessionDate} from "../../util/settingsUtils";
import Button from "../../../component/button/Button";
import Image from "../../../component/image/Image";
import PeraToast from "../../../component/pera-toast/PeraToast";
import {appDBManager} from "../../../core/app/db";

function PeraConnectSession({session}: {session: AppDBSession}) {
  const {
    state: {accounts, masterkey},
    dispatch: dispatchAppState
  } = useAppContext();
  const toaster = useToaster();
  // eslint-disable-next-line no-magic-numbers
  const placeholderLetters = session.title.slice(0, 2);

  return (
    <div className={"pera-connect-session"}>
      <Image
        src={session.favicon}
        alt={`${session.title} favicon`}
        customClassName={"align-center--horizontally pera-connect-session__favicon"}
        customPlaceholder={
          <div
            className={
              "typography--medium-body text-color--main text--uppercase pera-connect-session__favicon--placeholder"
            }>
            {placeholderLetters}
          </div>
        }
      />

      <div className={"pera-connect-session__content"}>
        <p className={"typography--medium-body pera-connect-session__title"}>
          {session.title}
        </p>

        {session.description && (
          <p className={"typography--secondary-body pera-connect-session__description"}>
            {session.description}
          </p>
        )}

        <p className={"typography--tiny pera-connect-session__date"}>
          {formatPeraConnectSessionDate(session.date)}
        </p>

        <List
          items={session.accountAddresses}
          customClassName={"pera-connect-session__account-list"}>
          {(accountAddress) => (
            <ListItem>
              <p className={"typography--tagline pera-connect-session__account-name"}>
                {`Connected with ${accounts[accountAddress].name}`}
              </p>
            </ListItem>
          )}
        </List>
      </div>

      <Button
        size={"medium"}
        buttonType={"secondary"}
        customClassName={
          "align-center--horizontally pera-connect-session__disconnect-cta"
        }
        onClick={handleDisconnectSession}>
        <UnlinkIcon width={24} height={24} />
      </Button>
    </div>
  );

  async function handleDisconnectSession() {
    if (!masterkey) return;

    try {
      await appDBManager.delete("sessions")({key: session.url, encryptionKey: masterkey});

      dispatchAppState({
        type: "REMOVE_SESSION",
        url: session.url
      });
    } catch (error) {
      toaster.display({
        render() {
          return (
            <PeraToast
              type={"warning"}
              title={"Disconnection Failed"}
              detail={"We couldn't disconnect, please try again"}
            />
          );
        }
      });
    }
  }
}

export default PeraConnectSession;
