import {ReactComponent as LockIcon} from "../../core/ui/icons/lock.svg";
import {ReactComponent as CommandKeyIcon} from "../../core/ui/icons/command-key.svg";

import "./_lock-button.scss";

import Button from "../button/Button";
import {useAppContext} from "../../core/app/AppContext";
import useLockApp from "../../core/util/hook/useLockApp";

function LockButton() {
  const {
    state: {masterkey}
  } = useAppContext();
  const lockApp = useLockApp();
  const isLocked = !masterkey;

  return (
    <Button
      customClassName={"lock-button"}
      buttonType={"light"}
      onClick={handleLockingApp}
      isDisabled={isLocked}>
      <LockIcon width={16} height={16} />

      {isLocked ? (
        "Locked"
      ) : (
        <>
          {"Lock"}

          <span className={"lock-button__shortcut"}>
            <CommandKeyIcon />

            {"K"}
          </span>
        </>
      )}
    </Button>
  );

  function handleLockingApp() {
    if (!isLocked) lockApp();
  }
}

export default LockButton;
