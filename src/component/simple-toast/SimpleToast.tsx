import {ReactComponent as TickCircleIcon} from "../../core/ui/icons/tick-circle.svg";
import {ReactComponent as DangerIcon} from "../../core/ui/icons/danger.svg";

import {Fragment, useLayoutEffect} from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import "./_simple-toast.scss";

import {SimpleToastContextState} from "./util/simpleToastTypes";
import {SimpleToastItemContext} from "./SimpleToastItemContext";
import {useSimpleToaster, useSimpleToastContextState} from "./util/simpleToastHooks";

export interface SimpleToastProps {
  data: SimpleToastContextState["toast"];
}

function SimpleToast({data}: SimpleToastProps) {
  const contextState = useSimpleToastContextState();
  const {hide} = useSimpleToaster();

  useLayoutEffect(() => {
    const timeoutId = setTimeout(() => {
      hide();
    }, contextState.defaultAutoCloseTimeout);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [contextState.defaultAutoCloseTimeout, hide, contextState.toast?.id]);

  return ReactDOM.createPortal(
    contextState.toast ? (
      <SimpleToastItemContext.Provider value={{toastId: data?.id || ""}}>
        <div
          className={classNames(
            "simple-toast",
            `simple-toast--${data?.type || "info"}`,
            data?.customClassName
          )}>
          {renderIcon()}
          <p className={"typography--secondary-bold-body"}>{data?.message}</p>
        </div>
      </SimpleToastItemContext.Provider>
    ) : (
      <Fragment />
    ),
    document.querySelector("#simple-toast-root")!
  );

  function renderIcon() {
    let icon;

    if (data?.type === "success") {
      icon = <TickCircleIcon width={18} height={18} />;
    } else if (data?.type === "error") {
      icon = <DangerIcon width={18} height={18} />;
    }

    return icon;
  }
}

export default SimpleToast;
