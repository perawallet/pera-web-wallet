import "./_account-name-form.scss";

import {ComponentProps, SyntheticEvent} from "react";
import {FormField, Input, useToaster} from "@hipo/react-ui-toolkit";

import {validateAccountCreateForm} from "../../util/accountUtils";
import {useAppContext} from "../../../core/app/AppContext";
import PeraToast from "../../../component/pera-toast/PeraToast";
import Button from "../../../component/button/Button";
import useFormito from "../../../core/util/hook/formito/useFormito";

interface AccountNameFormProps extends Omit<ComponentProps<"form">, "onSubmit"> {
  ctaText: string;
  onFormSubmit: (accountName: string) => unknown;
  description?: string;
  currentName?: string;
}

function AccountNameForm({
  ctaText,
  onFormSubmit,
  currentName = "",
  description = "Name your account to easily identify it while using Pera Wallet. These names are stored locally, and can only be seen by you.",
  ...formProps
}: AccountNameFormProps) {
  const {
    state: {accounts}
  } = useAppContext();
  const toaster = useToaster();
  const {
    formitoState: {accountName},
    dispatchFormitoAction
  } = useFormito({accountName: currentName});

  return (
    <form onSubmit={handleFormSubmit} {...formProps}>
      {description && (
        <p
          className={
            "typography--body text-color--gray account-name-form__name-description"
          }>
          {description}
        </p>
      )}

      <FormField
        customClassName={"account-name-form__name-input-box"}
        labelledBy={"Account Name"}
        label={"Account Name"}>
        {/* Animated placeholder PR Link: https://github.com/perawallet/pera-wallet-web/pull/26
          We may consider to make it component in the future */}
        <p
          className={
            "typography--buton text-color--gray-lightest account-name-form__name-input__placeholder"
          }>
          {"How about "}
          <span
            className={
              "text-color--gray-light account-name-form__name-input__placeholder__animated"
            }
          />
        </p>

        <Input
          name={"accountName"}
          customClassName={"account-name-form__name-input"}
          placeholder={" "}
          value={accountName}
          onChange={handleAccountNameChange}
        />
      </FormField>

      <Button
        type={"submit"}
        buttonType={"primary"}
        size={"large"}
        customClassName={"account-name-form__cta"}
        isDisabled={!accountName?.length}>
        {ctaText || "Create Account"}
      </Button>
    </form>
  );

  function handleFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationInfo = validateAccountCreateForm(accounts, accountName as string);

    if (validationInfo) {
      return toaster.display({
        render() {
          return (
            <PeraToast
              type={"warning"}
              title={validationInfo.title}
              detail={validationInfo.message && validationInfo.message[0]}
            />
          );
        }
      });
    }

    return onFormSubmit(accountName as string);
  }

  function handleAccountNameChange(event: SyntheticEvent<HTMLInputElement>) {
    dispatchFormitoAction({
      type: "SET_FORM_VALUE",
      payload: {
        accountName: event.currentTarget.value
      }
    });
  }
}

export default AccountNameForm;
