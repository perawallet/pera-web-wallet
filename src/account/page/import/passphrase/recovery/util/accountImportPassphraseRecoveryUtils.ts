import {MNEMONIC_LENGTH} from "../../../../../util/accountConstants";

function validatePassphraseForm(mnemonicKeys: string[]) {
  return (
    mnemonicKeys.filter((key) => Boolean(key) && key.trim()).length === MNEMONIC_LENGTH
  );
}

export {validatePassphraseForm};
