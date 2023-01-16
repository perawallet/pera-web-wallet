interface SignedTxn {
  txnId: string;
  signedTxn: string;
}

interface TransactionSignPageState {
  hasMessageReceived: boolean;
  isSignStarted: boolean;
  txns: Transaction[];
  currentSession: AppDBSession | null;
  signerAddress: string;
  signerAccountName: string;
}
