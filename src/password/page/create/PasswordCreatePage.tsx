import {ReactComponent as PasswordHiddenIcon} from "../../../core/ui/icons/password-hidden.svg";
import {ReactComponent as PasswordVisibleIcon} from "../../../core/ui/icons/password-visible.svg";
import {ReactComponent as CheckmarkIcon} from "../../../core/ui/icons/checkmark.svg";
import {ReactComponent as WarningIcon} from "../../../core/ui/icons/warning.svg";

import "./_password-create-page.scss";

import {useEffect, useRef, useState} from "react";
import {Location, Navigate, useNavigate} from "react-router-dom";
import {FormField} from "@hipo/react-ui-toolkit";

import ROUTES from "../../../core/route/routes";
import {useAppContext} from "../../../core/app/AppContext";
import useFormito from "../../../core/util/hook/formito/useFormito";
import {validatePasswordCreateForm} from "../../util/passwordUtils";
import PeraPasswordInput from "../../../component/pera-password-input/PeraPasswordInput";
import Button from "../../../component/button/Button";
import {encryptSK, decryptSK, hashPassword} from "../../../core/util/nacl/naclUtils";
import InfoBox from "../../../component/info-box/InfoBox";
import {useSimpleToaster} from "../../../component/simple-toast/util/simpleToastHooks";
import useLocationWithState from "../../../core/util/hook/useLocationWithState";
import webStorage, {STORED_KEYS} from "../../../core/util/storage/web/webStorage";
import {appDBManager} from "../../../core/app/db";
import {useModalDispatchContext} from "../../../component/modal/context/ModalContext";
import {CHANGE_PASSCODE_MODAL_ID} from "../../../settings/page/settings/util/settingsConstants";
import {
  encryptedWebStorageUtils,
  getCommonAppState
} from "../../../core/util/storage/web/webStorageUtils";
import {usePortfolioContext} from "../../../overview/context/PortfolioOverviewContext";

const initialCreatePasswordForm = {
  password: "",
  passwordConfirmation: ""
};

type LocationState = {
  from?: Location;
};

interface PasswordCreatePageProps {
  type?: "default" | "connect" | "change";
}

// eslint-disable-next-line complexity
function PasswordCreatePage({type = "default"}: PasswordCreatePageProps) {
  const navigate = useNavigate();
  const {from} = useLocationWithState<LocationState>();
  const {
    state: {hashedMasterkey: userHasKey, masterkey},
    dispatch: dispatchAppState
  } = useAppContext();
  const {
    formitoState: {password, passwordConfirmation},
    dispatchFormitoAction: dispatchCreatePasswordFormAction
  } = useFormito(initialCreatePasswordForm);
  const simpleToaster = useSimpleToaster();
  const validationInfo = validatePasswordCreateForm(password, passwordConfirmation);
  const isButtonDisabled =
    !password ||
    !passwordConfirmation ||
    validationInfo.password.length > 0 ||
    validationInfo.passwordConfirmation.length > 0;
  const [isPasswordConfirmStarted, setPasswordConfirmStarted] = useState(false);
  const hashedMasterKeyRef = useRef(userHasKey);
  const dispatchModalStateAction = useModalDispatchContext();
  const {refetchAccounts} = usePortfolioContext() || {};

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
        {type === "change" ? "Set new passcode" : "Create a passcode"}
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
          label={`${type === "change" ? "New" : "Create"} Passcode`}
          customClassName={"password-create__form__password-form-field"}
          errorMessages={password ? validationInfo.password : undefined}>
          <PeraPasswordInput
            customClassName={"password-create__form__password-input"}
            placeholder={`Enter ${type === "change" ? "your new" : ""} passcode`}
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
            placeholder={`Enter your ${type === "change" ? "new" : ""} passcode again`}
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
          {type === "change" ? "Change Passcode" : "Submit"}
        </Button>

        {type === "change" && (
          <Button
            customClassName={"password-create__form__cta"}
            buttonType={"light"}
            type={"button"}
            size={"large"}
            onClick={handleChangePasswordCloseClick}>
            {"Cancel"}
          </Button>
        )}
      </form>

      {type !== "change" && (
        <p
          className={
            "typography--tiny text-color--gray password-create__terms-and-conditions"
          }>
          {"By creating an account, you agree to Pera Wallet’s "}

          <a
            className={
              "typography--bold-tiny password-create__terms-and-conditions__link"
            }
            href={"https://perawallet.app/terms-and-services/"}
            target={"_blank"}
            rel={"noopener noreferrer"}>
            {"Terms and Conditions"}
          </a>

          {" and "}

          <a
            className={
              "typography--bold-tiny password-create__terms-and-conditions__link"
            }
            href={"https://perawallet.app/privacy-policy/"}
            target={"_blank"}
            rel={"noopener noreferrer"}>
            {"Privacy Policy"}
          </a>
        </p>
      )}
    </div>
  );

  async function onPasswordSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    setPasswordConfirmStarted(true);
    event.preventDefault();

    try {
      const hashedMasterkey = hashPassword(password);

      if (type === "change") {
        const {hashedMasterkey: oldPasswordHash} = getCommonAppState();

        if (hashedMasterkey === oldPasswordHash) {
          simpleToaster.display({
            type: "error",
            message: "New passcode couldn't be same with the old one."
          });

          return;
        }

        await handleChangePasscode(password);
      }

      webStorage.local.setItem(STORED_KEYS.HASHED_MASTERKEY, hashedMasterkey);

      dispatchAppState({
        type: "SET_KEY",
        keys: {masterkey: password, hashedMasterkey}
      });

      if (type === "default") {
        navigate(from?.pathname || ROUTES.ACCOUNT.ROUTE);
      } else if (type === "change") {
        handleChangePasswordCloseClick();

        refetchAccounts();

        simpleToaster.display({
          type: "success",
          message: "Changed passcode successfully."
        });
      }
    } catch (error) {
      console.error(error);

      simpleToaster.display({
        type: "error",
        message: `There is an error ${
          type === "change" ? "changing your password" : "creating your account"
        }, please try again later.`
      });
    } finally {
      setPasswordConfirmStarted(false);
    }
  }

  async function handleChangePasscode(newPasscode: string) {
    if (type !== "change" || !masterkey) return;

    const oldPasscode = masterkey;

    // Indexed DB
    const accounts = await appDBManager.decryptTableEntries(
      "accounts",
      oldPasscode
    )("address");
    const sessions = await appDBManager.decryptTableEntries(
      "sessions",
      oldPasscode
    )("url");

    const dbEntryPromises = [];

    for (const address in accounts) {
      const accountPk = accounts[address].pk;
      let account = accounts[address];

      // it could be watch or ledger account
      if (accountPk) {
        const decryptedPk = await decryptSK(accountPk, oldPasscode!);

        const newEncryptedPk = await encryptSK(decryptedPk, newPasscode);

        account = {...account, pk: newEncryptedPk};
      }

      dbEntryPromises.push(appDBManager.set("accounts", newPasscode!)(address, account));
    }

    for (const url in sessions) {
      dbEntryPromises.push(
        appDBManager.set("sessions", newPasscode!)(url, sessions[url])
      );
    }

    // WebStorage Encrypted Infos
    const deviceInfo = (await encryptedWebStorageUtils(oldPasscode!).get(
      STORED_KEYS.DEVICE_INFO
    )) as DeviceInfo;

    await encryptedWebStorageUtils(newPasscode).set(STORED_KEYS.DEVICE_INFO, deviceInfo);

    await Promise.all(dbEntryPromises);
  }

  function handleFieldChange(event: React.SyntheticEvent<HTMLInputElement>) {
    return dispatchCreatePasswordFormAction({
      type: "SET_FORM_VALUE",
      payload: {
        [event.currentTarget.name]: event.currentTarget.value
      }
    });
  }

  function handleChangePasswordCloseClick() {
    if (type !== "change") return;

    dispatchModalStateAction({
      type: "CLOSE_MODAL",
      payload: {id: CHANGE_PASSCODE_MODAL_ID}
    });
  }
}

export default PasswordCreatePage;
