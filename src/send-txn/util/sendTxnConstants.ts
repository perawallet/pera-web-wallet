export const ALGORAND_ADDRESS_LENGTH = 58;
export const ALGORAND_TXN_NOTE_MAX_LENGTH = 1000;
export const ALGORAND_DEFAULT_TXN_WAIT_ROUNDS = 1000;

export enum SEND_TXN_FORM_VALIDATION_MESSAGES {
  INVALID_ADDRESS = "Recipient address is not valid.",
  ACCOUNT_BALANCE = "Balance  is not enough for this transaction.",
  INVALID_TXN_LENGTH = "Txn note should be no longer than 1000 characters."
}
