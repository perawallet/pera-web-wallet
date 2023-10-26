import {MNEMONIC_LENGTH} from "../../../../../util/accountConstants";

function validatePassphraseForm({
  mnemonicKeys,
  mnemonicLength = MNEMONIC_LENGTH
}: {
  mnemonicKeys: string[];
  mnemonicLength?: number;
}) {
  return (
    mnemonicKeys.filter((key) => Boolean(key) && key.trim()).length === mnemonicLength
  );
}

export {validatePassphraseForm};
