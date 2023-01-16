import {ReactComponent as DeleteIcon} from "../../../../../core/ui/icons/lock-password-login-delete.svg";

import {SyntheticEvent} from "react";
import {FormField, Input} from "@hipo/react-ui-toolkit";

import Button from "../../../../../component/button/Button";
import useFormito from "../../../../../core/util/hook/formito/useFormito";
import {validateClearWalletDataConfirmationText} from "../../util/clearWalletDataModalUtils";

interface ClearWalletDataModalConfirmationViewProps {
  onSubmit: VoidFunction;
}

function ClearWalletDataModalConfirmationView({
  onSubmit
}: ClearWalletDataModalConfirmationViewProps) {
  const {
    formitoState: {confirmationText},
    dispatchFormitoAction
  } = useFormito({confirmationText: ""});

  return (
    <>
      <div className={"clear-wallet-data-modal__icon-wrapper"}>
        <DeleteIcon />
      </div>

      <p className={"typography--h2"}>{"Clear Wallet Data"}</p>

      <p
        className={
          "typography--body text-color--gray text--centered clear-wallet-data-modal__confirmation-description"
        }>
        {"You are about to unlink your Algorand accounts from this device. "}
        <span className={"typography--medium-body text-color--main"}>
          {"You will no longer be able to access your data using your passcode. "}
        </span>
        {"This does not delete your accounts."}
      </p>

      <p className={"typography--body text-color--gray text--centered"}>
        {"Please type "}
        <span className={"typography--medium-body text-color--main"}>
          {"clear wallet data"}
        </span>
        {" to confirm"}
      </p>

      <form className={"clear-wallet-data-modal__confirmation-form"}>
        <FormField
          labelledBy={"confirmationText"}
          customClassName={"clear-wallet-data-modal__confirmation-input-box"}>
          <Input
            name={"confirmationText"}
            onChange={handleConfirmationTextChange}
            value={confirmationText}
            placeholder={"Type here"}
          />
        </FormField>

        <Button
          buttonType={"danger"}
          size={"large"}
          type={"submit"}
          onClick={onSubmit}
          isDisabled={!validateClearWalletDataConfirmationText(confirmationText)}
          customClassName={"clear-wallet-data-modal__confirmation-cta"}>
          {"I understand the consequences, clear wallet data"}
        </Button>
      </form>
    </>
  );

  function handleConfirmationTextChange(event: SyntheticEvent<HTMLInputElement>) {
    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {
        confirmationText: event.currentTarget.value
      }
    });
  }
}

export default ClearWalletDataModalConfirmationView;
