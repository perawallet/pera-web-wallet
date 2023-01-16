/* eslint-disable no-magic-numbers */
import algosdk from "algosdk";

import {encodeUnsignedTransactionInBase64} from "../../core/util/blob/blobUtils";
import {hasInvalidGroupOnTransactions} from "./transactionUtils";

const suggestedParams = {
  fee: 1000,
  firstRound: 2168,
  lastRound: 2178,
  genesisHash: "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
  genesisID: "testnet-v1.0"
};

function prepareMockTransactions(): algosdk.Transaction[] {
  const mockTransactions: algosdk.Transaction[] = [];

  for (let i = 0; i < 7; i++) {
    mockTransactions.push(
      algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: "JFK7NTHGDFIPJNWAWJS54NW7K53C24V4ZYLMTUWAUSEO4MK53PVJQXBMBM",
        to: "ACKNL76PGZKL673I7P6Z524323E34PSHRUYWM2XDZQWE3P2YJXK7QBOWI4",
        amount: 100000 + i,
        note: new Uint8Array(Buffer.from(`txn ${i}}`)),

        suggestedParams
      })
    );
  }

  return mockTransactions;
}

// Prepare couple of mock transactions & groups to simulate a transaction group
const transactions = prepareMockTransactions();
const groups = [
  [{txn: transactions[0]}, {txn: transactions[1]}],
  [{txn: transactions[2]}, {txn: transactions[3]}],
  [{txn: transactions[4]}, {txn: transactions[6]}]
];

// Assign a group ID to each transaction inside a group
groups.forEach((group) => algosdk.assignGroupID(group.map((toSign) => toSign.txn)));

// Encode transactions to base64 to lose context reference from source
const encodedTransactions = groups
  .flat()
  .map((transaction) => encodeUnsignedTransactionInBase64(transaction.txn));

describe("has invalid groups", () => {
  it("should return `true` if a transaction is missing from group", () => {
    // Randomly remove a transaction from the group
    const newEncodedTransactions = encodedTransactions.filter((_, index) => index !== 5);

    expect(hasInvalidGroupOnTransactions(newEncodedTransactions)).toBe(true);
  });

  it("should return `false` if all transactions represented in the group correctly", () => {
    expect(hasInvalidGroupOnTransactions(encodedTransactions)).toBe(false);
  });

  it("should return `false` if a single transaction represented in the group", () => {
    const transaction = prepareMockTransactions()[0];

    // Assign a group ID to the transaction
    algosdk.assignGroupID([transaction]);

    // Encode transaction to base64 to lose context reference from source
    const encodedTransaction = encodeUnsignedTransactionInBase64(transaction);

    expect(hasInvalidGroupOnTransactions([encodedTransaction])).toBe(false);
  });

  it("should return `false` if pass empty group", () => {
    expect(hasInvalidGroupOnTransactions([])).toBe(false);
  });
});
/* eslint-enable no-magic-numbers */
