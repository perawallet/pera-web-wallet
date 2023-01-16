import {NETWORK_MISMATCH_MESSAGE} from "../../../../core/util/algod/algodConstants";

const TRANSACTION_SIGN_ERRORS = {
  INVALID_ASSET_ID: {
    title: "Invalid Asset ID",
    description:
      "We can't process this transaction because the asset ID provided is invalid. Contact the dApp developer for further information."
  },
  UNSUPPORTED_TXN_TYPE: {
    title: "Unsupported Transaction Type",
    description:
      "Unfortunately we can’t process this type of transaction. Contact the dApp developer to resolve this."
  },
  NETWORK_MISMATCH: {
    title: "Network mismatch",
    description: NETWORK_MISMATCH_MESSAGE
  },
  AUTH_ADDRESS_NOT_VALID: {
    title: "Invalid Public Key",
    description:
      "We can't process this transaction because the authorization address provided is invalid. Contact the dApp developer for further information."
  },
  OBSCURED_TRANSACTIONS: {
    title: "Obscured Transactions",
    description:
      "This transaction group contains one or more obscured transactions. An obscured transaction means a dApp or other party has signed a transaction within this group, but has not sent it to us to display. Pera does not allow users to sign groups containing obscured transactions. Please contact the dApp developer for more information."
  }
};

export {TRANSACTION_SIGN_ERRORS};
