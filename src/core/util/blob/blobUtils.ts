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

function uint8ArrayToHex(data: Uint8Array): string {
  return Buffer.from(data).toString("hex");
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

function stringToBase64(data: string) {
  return Buffer.from(data, "base64").toString();
}

export {
  base64ToUint8Array,
  uint8ArrayToBase64,
  uint8ArrayToString,
  uint8ArrayToHex,
  stringToUint8Array,
  stringBytesToUint8Array,
  encodeUnsignedTransactionInBase64,
  stringToBase64
};
