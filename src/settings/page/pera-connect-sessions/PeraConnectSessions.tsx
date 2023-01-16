import {ReactComponent as UnlinkIcon} from "../../../core/ui/icons/unlink.svg";
import {ReactComponent as ActivityIcon} from "../../../core/ui/icons/activity.svg";

import "./_pera-connect-sessions.scss";

import {useRef, useState} from "react";
import {useToaster, List, ListItem} from "@hipo/react-ui-toolkit";
import {useNavigate} from "react-router-dom";
import classNames from "classnames";

import GoBackButton from "../../../component/go-back-button/GoBackButton";
import PeraConnectSession from "../../component/pera-connect-session/PeraConnectSession";
import {useAppContext} from "../../../core/app/AppContext";
import Button from "../../../component/button/Button";
import PeraToast from "../../../component/pera-toast/PeraToast";
import ROUTES from "../../../core/route/routes";
import useScroll from "../../../core/util/hook/useScroll";
import {appDBManager} from "../../../core/app/db";

function PeraConnectSessions() {
  const {
    state: {sessions, preferredNetwork, masterkey},
    dispatch: dispatchAppState
  } = useAppContext();
  const toaster = useToaster();
  const navigate = useNavigate();
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const sessionsByNetwork = Object.values(sessions).filter(
    (session) => session.network === preferredNetwork
  );
  const isThereActiveSession = Object.keys(sessionsByNetwork).length > 0;

  useScroll(
    () => {
      setScrollPosition(Math.round(listContainerRef?.current?.scrollTop || 0));
    },
    {ref: listContainerRef}
  );

  return (
    <div className={"pera-connect-sessions-container"}>
      <div
        className={classNames("pera-connect-sessions-header", {
          "pera-connect-sessions-header--has-border": scrollPosition > 0
        })}>
        <GoBackButton
          text={"Pera Connect Sessions"}
          customClassName={"pera-connect-sessions__go-back-button"}
        />

        {isThereActiveSession && (
          <Button
            buttonType={"light"}
            size={"medium"}
            customClassName={
              "align-center--horizontally pera-connect-sessions__disconnect-all-cta"
            }
            onClick={disconnectAllSessions}>
            <UnlinkIcon width={16} height={16} />

            {"Disconnect all"}
          </Button>
        )}
      </div>

      {isThereActiveSession ? (
        <div ref={listContainerRef} className={"pera-connect-sessions"}>
          <List items={sessionsByNetwork}>
            {(session) => (
              <ListItem customClassName={"pera-connect-sessions__list-item"}>
                <PeraConnectSession session={session} />
              </ListItem>
            )}
          </List>
        </div>
      ) : (
        <div className={"pera-connect-sessions--empty"}>
          <ActivityIcon width={30} height={30} />

          <p className={"typography--body text-color--gray"}>{"No sessions yet"}</p>
        </div>
      )}
    </div>
  );

  async function disconnectAllSessions() {
    if (!masterkey) return;

    try {
      for (const session of sessionsByNetwork) {
        await appDBManager.delete("sessions")({
          key: session.url,
          encryptionKey: masterkey
        });

        dispatchAppState({
          type: "REMOVE_SESSION",
          url: session.url
        });
      }

      navigate(ROUTES.SETTINGS.ROUTE);
    } catch (error) {
      toaster.display({
        render() {
          return (
            <PeraToast
              type={"warning"}
              title={"Disconnection Failed"}
              detail={"We couldn't disconnect the sessions, please try again"}
            />
          );
        }
      });
    }
  }
}

export default PeraConnectSessions;
