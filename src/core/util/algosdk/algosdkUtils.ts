// @ts-ignore wordlist is not exported from algosdk/types
import ALGORAND_MNEMONIC_WORDLIST from "algosdk/dist/esm/mnemonic/wordlists/english";

/**
 * Checks the given word exists in the mnemonic wordlist
 * @param {string} word string
 * @returns {boolean}
 */
function isValidMnemonicWord(word: string): boolean {
  return ALGORAND_MNEMONIC_WORDLIST.includes(word);
}

export {ALGORAND_MNEMONIC_WORDLIST, isValidMnemonicWord};
