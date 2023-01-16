import {ReactComponent as PasswordHiddenIcon} from "../../../core/ui/icons/password-hidden.svg";
import {ReactComponent as PasswordVisibleIcon} from "../../../core/ui/icons/password-visible.svg";
import {ReactComponent as CheckmarkIcon} from "../../../core/ui/icons/checkmark.svg";
import {ReactComponent as WarningIcon} from "../../../core/ui/icons/warning.svg";

import "./_password-create-page.scss";

import {useEffect, useRef, useState} from "react";
import {Location, Navigate, useNavigate} from "react-router-dom";
import {FormField} from "@hipo/react-ui-toolkit";
import classNames from "classnames";

import ROUTES from "../../../core/route/routes";
import {useAppContext} from "../../../core/app/AppContext";
import useFormito from "../../../core/util/hook/formito/useFormito";
import {validatePasswordCreateForm} from "../../util/passwordUtils";
import PeraPasswordInput from "../../../component/pera-password-input/PeraPasswordInput";
import Button from "../../../component/button/Button";
import {hashPassword} from "../../../core/util/nacl/naclUtils";
import InfoBox from "../../../component/info-box/InfoBox";
import {withGoBackLink} from "../../../core/route/context/NavigationContext";
import {useSimpleToaster} from "../../../component/simple-toast/util/simpleToastHooks";
import useLocationWithState from "../../../core/util/hook/useLocationWithState";
import webStorage, {STORED_KEYS} from "../../../core/util/storage/web/webStorage";

const initialCreatePasswordForm = {
  password: "",
  passwordConfirmation: ""
};

type LocationState = {
  from?: Location;
};

interface PasswordCreatePageProps {
  type?: "default" | "connect";
}

function PasswordCreatePage({type = "default"}: PasswordCreatePageProps) {
  const navigate = useNavigate();
  const {from} = useLocationWithState<LocationState>();
  const {
    state: {hashedMasterkey: userHasKey},
    dispatch: dispatchAppState
  } = useAppContext();
  const {
    formitoState: {password, passwordConfirmation},
    dispatchFormitoAction: dispatchCreatePasswordFormAction
  } = useFormito(initialCreatePasswordForm);
  const simpleToaster = useSimpleToaster();
  const validationInfo = validatePasswordCreateForm(password, passwordConfirmation);
  const passwordFormFieldClassname = classNames(
    "password-create__form__password-form-field"
  );
  const isButtonDisabled =
    !password ||
    !passwordConfirmation ||
    validationInfo.password.length > 0 ||
    validationInfo.passwordConfirmation.length > 0;
  const [isPasswordConfirmStarted, setPasswordConfirmStarted] = useState(false);
  const hashedMasterKeyRef = useRef(userHasKey);

  useEffect(
    // clean up formito state on unmount
    () => () =>
      dispatchCreatePasswordFormAction({
        type: "SET_FORM_VALUE",
        payload: {password: "", passwordConfirmation: ""}
      }),
    [dispatchCreatePasswordFormAction]
  );

  if (type === "default" && hashedMasterKeyRef.current) {
    return <Navigate to={ROUTES.PASSWORD.ROUTE} />;
  }

  return (
    <div className={`password-create password-create--${type}`}>
      <p className={"typography--h2 text-color--main password-create__title"}>
        {"Create a passcode"}
      </p>

      <InfoBox
        infoText={
          "Your passcode is used to encrypt your accounts locally, only on this device."
        }
        className={"password-create__info-box"}>
        <a
          href={
            "https://support.perawallet.app/en/article/pera-web-wallet-1jxogir/?bust=1669024682931"
          }
          target={"_blank"}
          rel={"noreferrer"}
          className={
            "typography--secondary-bold-body text-color--main password-create__info-box-link"
          }>
          {"Learn more →"}
        </a>
      </InfoBox>

      <form className={"password-create__form"} onSubmit={onPasswordSubmit}>
        <FormField
          labelledBy={"Password"}
          label={"Create Passcode"}
          customClassName={passwordFormFieldClassname}
          errorMessages={password ? validationInfo.password : undefined}>
          <PeraPasswordInput
            customClassName={"password-create__form__password-input"}
            placeholder={"Enter passcode"}
            hideIcon={password && <PasswordHiddenIcon />}
            revealIcon={password && <PasswordVisibleIcon />}
            infoIcon={
              password &&
              (validationInfo.password.length ? (
                <WarningIcon width={20} height={20} />
              ) : (
                <CheckmarkIcon width={20} height={20} />
              ))
            }
            onChange={handleFieldChange}
            name={"password"}
          />
        </FormField>

        <FormField
          labelledBy={"PasswordConfirmation"}
          label={"Confirm Passcode"}
          customClassName={"password-create__form__confirmation-form-field"}
          errorMessages={validationInfo.passwordConfirmation}>
          <PeraPasswordInput
            customClassName={"password-create__form__password-input"}
            placeholder={"Enter your passcode again"}
            hideIcon={passwordConfirmation && <PasswordHiddenIcon />}
            revealIcon={passwordConfirmation && <PasswordVisibleIcon />}
            infoIcon={
              passwordConfirmation &&
              (validationInfo.passwordConfirmation.length ? (
                <WarningIcon width={20} height={20} />
              ) : (
                <CheckmarkIcon width={20} height={20} />
              ))
            }
            onChange={handleFieldChange}
            name={"passwordConfirmation"}
          />
        </FormField>

        <Button
          shouldDisplaySpinner={isPasswordConfirmStarted}
          isDisabled={isButtonDisabled}
          customClassName={"password-create__form__cta"}
          type={"submit"}
          size={"large"}>
          {"Submit"}
        </Button>
      </form>

      <p
        className={
          "typography--tiny text-color--gray password-create__terms-and-conditions"
        }>
        {"By creating an account, you agree to Pera Wallet’s "}

        <a
          className={"typography--bold-tiny password-create__terms-and-conditions__link"}
          href={"https://perawallet.app/terms-and-services/"}
          target={"_blank"}
          rel={"noopener noreferrer"}>
          {"Terms and Conditions"}
        </a>

        {" and "}

        <a
          className={"typography--bold-tiny password-create__terms-and-conditions__link"}
          href={"https://perawallet.app/privacy-policy/"}
          target={"_blank"}
          rel={"noopener noreferrer"}>
          {"Privacy Policy"}
        </a>
      </p>
    </div>
  );

  function onPasswordSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    setPasswordConfirmStarted(true);
    event.preventDefault();

    try {
      const hashedMasterkey = hashPassword(password);

      webStorage.local.setItem(STORED_KEYS.HASHED_MASTERKEY, hashedMasterkey);

      dispatchAppState({
        type: "SET_KEY",
        keys: {masterkey: password, hashedMasterkey}
      });

      if (type === "default") {
        navigate(from?.pathname || ROUTES.ACCOUNT.ROUTE);
      }
    } catch (error) {
      console.error(error);
      simpleToaster.display({
        type: "error",
        message: "There is an error creating your account, please try again later."
      });
    } finally {
      setPasswordConfirmStarted(false);
    }
  }

  function handleFieldChange(event: React.SyntheticEvent<HTMLInputElement>) {
    return dispatchCreatePasswordFormAction({
      type: "SET_FORM_VALUE",
      payload: {
        [event.currentTarget.name]: event.currentTarget.value
      }
    });
  }
}

export default withGoBackLink(PasswordCreatePage, ROUTES.BASE);
