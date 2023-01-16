import algosdk, {Transaction} from "algosdk";

function base64ToUint8Array(data: string) {
  return Uint8Array.from(window.atob(data), (value) => value.charCodeAt(0));
}

function uint8ArrayToBase64(data: Uint8Array): string {
  return Buffer.from(data).toString("base64");
}

function uint8ArrayToString(data: Uint8Array): string {
  return Buffer.from(data).toString();
}

function stringToUint8Array(data: string): Uint8Array {
  return Uint8Array.from(Buffer.from(data));
}

function stringBytesToUint8Array(data: string): Uint8Array {
  return new Uint8Array(data.split(",").map(Number));
}

function encodeUnsignedTransactionInBase64(txn: Transaction): string {
  return Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString("base64");
}

export {
  base64ToUint8Array,
  uint8ArrayToBase64,
  uint8ArrayToString,
  stringToUint8Array,
  stringBytesToUint8Array,
  encodeUnsignedTransactionInBase64
};
