import {ReactComponent as CloseIcon} from "../../../ui/icons/close.svg";
import moonPayLogoURL from "../../../ui/image/moon-pay-logo.svg";

import "./_moon-pay-modal.scss";

import {useEffect} from "react";

import useAsyncProcess from "../../../network/async-process/useAsyncProcess";
import {peraApi} from "../../../util/pera/api/peraApi";
import Button from "../../../../component/button/Button";
import PeraLoader from "../../../../component/loader/pera/PeraLoader";

interface MoonPayModalProps {
  address: string;
  onClose: VoidFunction;
}

export const MOON_PAY_MODAL_ID = "moon-pay-modal";

function MoonPayModal({address, onClose}: MoonPayModalProps) {
  const {runAsyncProcess, state} = useAsyncProcess<{url: string}>();

  useEffect(() => {
    runAsyncProcess(
      peraApi.fetchMoonPayURL({
        wallet_address: address,
        redirect_url: "https://web.perawallet.app"
      })
    );
  }, [address, runAsyncProcess]);

  if (state.isRequestPending) {
    return (
      <div className={"moon-pay-modal moon-pay-modal--loading"}>
        <PeraLoader mode={"gray"} />
      </div>
    );
  }

  return (
    <div className={"moon-pay-modal"}>
      <div className={"moon-pay-modal__header"}>
        <p className={"typography--bold-body text-color--main"}>{"Add Funds"}</p>

        <Button
          buttonType={"ghost"}
          onClick={onClose}
          customClassName={"moon-pay-modal__close-button"}>
          <CloseIcon />
        </Button>
      </div>

      <div className={"moon-pay-modal__iframe-container"}>
        {state.data?.url ? (
          <>
            <iframe
              className={"moon-pay-modal__iframe"}
              title={"MoonPay widget"}
              allow={"accelerometer; autoplay; camera; gyroscope; payment"}
              frameBorder={"0"}
              height={"100%"}
              src={state.data.url}
              width={"100%"}>
              <p>{"Your browser does not support iframes."}</p>
            </iframe>
          </>
        ) : (
          <p>{"We failed to generate MoonPay URL."}</p>
        )}
      </div>

      <div className={"moon-pay-modal__footer"}>
        <p className={"typography--tiny text-color--gray"}>{"Powered by "}</p>

        <img src={moonPayLogoURL} alt={"MoonPay logo"} />
      </div>
    </div>
  );
}

export default MoonPayModal;
