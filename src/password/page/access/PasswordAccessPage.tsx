import {ReactComponent as PasswordVisibleIcon} from "../../../core/ui/icons/password-visible.svg";
import {ReactComponent as PasswordHiddenIcon} from "../../../core/ui/icons/password-hidden.svg";
import {ReactComponent as LockPasswordLoginIcon} from "../../../core/ui/icons/lock-password-login.svg";
import {ReactComponent as LockPasswordLoginErrorIcon} from "../../../core/ui/icons/lock-password-login-error.svg";
import {ReactComponent as LockPasswordLoginSuccessIcon} from "../../../core/ui/icons/lock-password-login-success.svg";
import {ReactComponent as WarningIcon} from "../../../core/ui/icons/warning.svg";
import {ReactComponent as CheckmarkIcon} from "../../../core/ui/icons/checkmark.svg";

import "./_password-access-page.scss";

import {SyntheticEvent} from "react";
import {useNavigate} from "react-router";
import {Navigate, To} from "react-router-dom";
import {FormField} from "@hipo/react-ui-toolkit";
import classNames from "classnames";

import ROUTES from "../../../core/route/routes";
import {useAppContext} from "../../../core/app/AppContext";
import useFormito from "../../../core/util/hook/formito/useFormito";
import {hashPassword} from "../../../core/util/nacl/naclUtils";
import Button, {ButtonProps} from "../../../component/button/Button";
import PeraPasswordInput from "../../../component/pera-password-input/PeraPasswordInput";
import useLocationWithState from "../../../core/util/hook/useLocationWithState";
import {appDBManager} from "../../../core/app/db";

const initialPasswordAccessForm = {
  isDirty: false,
  accessStatus: undefined as undefined | "error" | "success",
  errorMessages: [] as string[]
};

interface PasswordAccessPageProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaType?: ButtonProps["buttonType"];
  onSubmit?: VoidFunction;
  onCancel?: VoidFunction;
  hasCancelButton?: boolean;
  customClassName?: string;
  type?: "default" | "modal" | "connect-new-tab" | "embedded";
}

export const PASSWORD_ACCESS_MODAL_ID = "password-access-modal";

type LocationState = {
  from: Location;
  isNavigated?: boolean;
  ctaText?: string;
};

function PasswordAccessPage({
  title,
  description,
  ctaText,
  onSubmit,
  ctaType = "primary",
  onCancel,
  hasCancelButton,
  customClassName,
  type = "default"
}: PasswordAccessPageProps) {
  const {
    from,
    isNavigated,
    ctaText: ctaTextFromLocationState
  } = useLocationWithState<LocationState>();
  const navigate = useNavigate();
  const {
    state: {hashedMasterkey},
    dispatch: dispatchAppState
  } = useAppContext();
  const {formitoState, dispatchFormitoAction: dispatchCreatePasswordFormAction} =
    useFormito(initialPasswordAccessForm);

  if (type === "default" && !hashedMasterkey) {
    return <Navigate to={ROUTES.PASSWORD.CREATE.FULL_PATH} />;
  }

  return (
    <div
      className={classNames(`password-access password-access--${type}`, customClassName)}>
      <div className={"align-center--horizontally password-access__hero"}>
        <div className={"password-access__hero-icon"}>{renderHeroIcon()}</div>

        {type !== "embedded" && (
          <p
            className={
              "typography--h2 text-color--main text--centered password-access__hero-title"
            }>
            {title || "Unlock Pera Wallet"}
          </p>
        )}

        <p
          className={
            "typography--body text-color--gray-light text--centered password-access__hero-description"
          }>
          {description || "Enter your passcode to unlock your wallet"}
        </p>
      </div>

      <form onSubmit={onAccessFormSubmit} className={"password-access__form"}>
        <FormField
          labelledBy={"Password"}
          customClassName={"password-access__form-field"}
          errorMessages={formitoState.errorMessages}>
          <PeraPasswordInput
            customClassName={"password-access__form-field__input"}
            placeholder={"Enter passcode"}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={true}
            hideIcon={formitoState.isDirty && <PasswordHiddenIcon />}
            revealIcon={formitoState.isDirty && <PasswordVisibleIcon />}
            infoIcon={
              formitoState.isDirty &&
              (formitoState.accessStatus === "error" ? (
                <WarningIcon width={20} height={20} />
              ) : (
                <CheckmarkIcon width={20} height={20} />
              ))
            }
            onChange={onPasswordInputChange}
            name={"password"}
          />
        </FormField>

        <Button
          isDisabled={!formitoState.isDirty}
          buttonType={ctaType}
          customClassName={"password-access__form-field__cta"}
          type={"submit"}
          size={"large"}>
          {ctaText || ctaTextFromLocationState || "Launch Pera"}
        </Button>

        {hasCancelButton && (
          <Button
            buttonType={"ghost"}
            size={"large"}
            customClassName={"password-access__form-field__cancel"}
            onClick={handleCancelClick}>
            {"Cancel"}
          </Button>
        )}
      </form>
    </div>
  );

  async function onAccessFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const passwordFormData = new FormData(event.currentTarget);
    const password = passwordFormData.get("password") as string;

    try {
      // decrypt accounts and sessions immediately user enter the password
      await syncIDB(password);

      if (onSubmit) {
        onSubmit();
      }

      if (type === "default") {
        navigate(
          {
            pathname: from?.pathname || ROUTES.OVERVIEW.ROUTE,
            search: from?.search
          },
          {
            replace: true,
            state: {isNavigated}
          }
        );
      }
    } catch (error) {
      dispatchCreatePasswordFormAction({
        type: "SET_FORM_VALUE",
        payload: {
          accessStatus: "error",
          errorMessages: ["Incorrect passcode, please try again"]
        }
      });
    }
  }

  async function syncIDB(masterkey: string) {
    if (hashPassword(masterkey) !== hashedMasterkey) {
      throw new Error("Incorrect password.");
    }

    const accounts = await appDBManager.decryptTableEntries(
      "accounts",
      masterkey
    )("address");
    const sessions = await appDBManager.decryptTableEntries("sessions", masterkey)("url");

    dispatchAppState({type: "SYNC_IDB", payload: {accounts, sessions}});
    dispatchAppState({type: "SET_MASTERKEY", masterkey});
  }

  function onPasswordInputChange(event: React.SyntheticEvent<HTMLInputElement>) {
    const password = event.currentTarget.value;
    const newFormState: typeof initialPasswordAccessForm = {
      ...initialPasswordAccessForm,
      isDirty: !!password,
      accessStatus: getPasswordAccessFormStatus(password)
    };
    const shouldUpdateFormitoState = Object.entries(formitoState).some(
      ([key, value]) => newFormState[key as keyof typeof formitoState] !== value
    );

    if (shouldUpdateFormitoState) {
      dispatchCreatePasswordFormAction({
        type: "SET_FORM_VALUE",
        payload: newFormState
      });
    }
  }

  function getPasswordAccessFormStatus(password: string) {
    let accessFormStatus: typeof initialPasswordAccessForm["accessStatus"];

    if (password) {
      accessFormStatus = hashPassword(password) === hashedMasterkey ? "success" : "error";
    }

    return accessFormStatus;
  }

  function renderHeroIcon() {
    switch (formitoState.accessStatus) {
      case "success":
        return <LockPasswordLoginSuccessIcon />;

      case "error":
        return <LockPasswordLoginErrorIcon />;

      default:
        return <LockPasswordLoginIcon />;
    }
  }

  function handleCancelClick() {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1 as unknown as To);
    }
  }
}

export default PasswordAccessPage;
