import React, {SyntheticEvent} from "react";
import {FormField, Input, useToaster} from "@hipo/react-ui-toolkit";

import "./_account-mnemonic-form.scss";

import {generateNumberArray, replaceAtIndex} from "../../../core/util/array/arrayUtils";
import {MNEMONIC_LENGTH} from "../../util/accountConstants";
import Button from "../../../component/button/Button";
import useFormito from "../../../core/util/hook/formito/useFormito";
import {validatePassphraseForm} from "../../page/import/passphrase/recovery/util/accountImportPassphraseRecoveryUtils";
import {MNEMONIC_KEYS_COMMA_OR_SPACE_REGEX} from "./util/accountMnemonicFormConstants";
import PeraToast from "../../../component/pera-toast/PeraToast";

interface AccountMnemonicFormProps {
  onFormSubmit: (mnemonicKeys: string[]) => void;
}

const initialMnemonicForm = {
  mnemonicKeys: [] as string[]
};

function AccountMnemonicForm({onFormSubmit}: AccountMnemonicFormProps) {
  const {
    formitoState: {mnemonicKeys},
    dispatchFormitoAction: dispatchMnemonicFormAction
  } = useFormito(initialMnemonicForm);
  const toaster = useToaster();

  return (
    <form
      className={"account-mnemonic-form__grid"}
      onSubmit={handleFormSubmit}
      onPaste={handlePaste}>
      {generateNumberArray(MNEMONIC_LENGTH).map((cellNumber) => (
        <FormField
          key={`mnemonic-cell-${cellNumber}`}
          customClassName={"account-mnemonic-form__grid-cell"}
          labelledBy={"Account Name"}
          label={String(cellNumber + 1)}>
          <Input
            name={`mnemonic-cell-${cellNumber}`}
            customClassName={"account-mnemonic-form__grid-input"}
            type={"text"}
            value={mnemonicKeys[cellNumber] || ""}
            onChange={handleChange}
          />
        </FormField>
      ))}

      <Button
        type={"submit"}
        customClassName={"account-mnemonic-form__cta"}
        buttonType={"primary"}
        isDisabled={!validatePassphraseForm(mnemonicKeys)}
        size={"large"}>
        {"Import Account"}
      </Button>
    </form>
  );

  function handleFormSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    onFormSubmit(mnemonicKeys);
  }

  function handlePaste(event: React.ClipboardEvent<HTMLFormElement>) {
    const clipboardData = event.clipboardData.getData("text");
    let clipboardWordList: string[] = [];

    if (clipboardData) {
      clipboardWordList = clipboardData.split(MNEMONIC_KEYS_COMMA_OR_SPACE_REGEX);
    }

    if (clipboardWordList.length === MNEMONIC_LENGTH) {
      dispatchMnemonicFormAction({
        type: "SET_FORM_VALUE",
        payload: {
          mnemonicKeys: clipboardWordList
        }
      });
    } else {
      toaster.display({
        render() {
          return (
            <PeraToast
              type={"warning"}
              title={"Not pasted correctly"}
              detail={
                "Please paste your passphare with 25 words separated with comma or space in between."
              }
              hasCloseButton={false}
            />
          );
        }
      });
    }
  }

  function handleChange(event: SyntheticEvent<HTMLInputElement>) {
    // @ts-ignore nativeEvent has not `inputType` in SyntheticEvent
    if (event.nativeEvent.inputType !== "insertFromPaste") {
      const [_mnemonic, _cell, inputIndex] = event.currentTarget.name.split("-");

      dispatchMnemonicFormAction({
        type: "SET_FORM_VALUE",
        payload: {
          mnemonicKeys: replaceAtIndex(
            mnemonicKeys,
            Number(inputIndex),
            event.currentTarget.value
          )
        }
      });
    }
  }
}

export default React.memo(AccountMnemonicForm);
