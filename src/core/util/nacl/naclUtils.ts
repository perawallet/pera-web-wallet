import nacl from "tweetnacl";
import scrypt from "scrypt-async";

import {
  uint8ArrayToBase64,
  base64ToUint8Array,
  stringToUint8Array,
  stringBytesToUint8Array,
  uint8ArrayToString
} from "../blob/blobUtils";

const NONCE_SK_SEPARATOR = "**";
const PASSWORD_SALT = "7376f7d53ab818f03ba381cedad3940b";

function generateNonce() {
  return nacl.randomBytes(nacl.secretbox.nonceLength);
}

function hashPassword(password: string): string {
  return uint8ArrayToBase64(nacl.hash(stringToUint8Array(password)));
}

function generateKeyDerivation(password: string): Promise<string> {
  return new Promise<string>((resolve) => {
    scrypt(
      // @ts-ignore Argument of type 'string' is not assignable to parameter of type 'number[]'
      // it's actually typed correctly but the compiler doesn't know
      stringToUint8Array(password),
      PASSWORD_SALT,
      {
        N: 16384,
        r: 8,
        p: 1,
        dkLen: 16,
        encoding: "hex"
      },
      (derivedKey: string) => {
        resolve(derivedKey);
      }
    );
  });
}

async function encryptSK(message: Uint8Array, key: string) {
  try {
    const password = await generateKeyDerivation(key);
    const nonce = generateNonce();
    const secretbox = nacl.secretbox(message, nonce, stringToUint8Array(password));

    return `${uint8ArrayToBase64(nonce)}${NONCE_SK_SEPARATOR}${uint8ArrayToBase64(
      secretbox
    )}`;
  } catch (error) {
    throw new Error("Encryption Error");
  }
}

async function decryptSK(
  sk: string,
  key: string,
  options?: undefined
): Promise<Uint8Array>;
async function decryptSK(
  sk: string,
  key: string,
  options?: {stringify: true}
): Promise<string>;
async function decryptSK(
  sk: string,
  key: string,
  options?: {stringify: boolean}
): Promise<string | Uint8Array> {
  try {
    const password = await generateKeyDerivation(key);
    const [nonce, secretbox] = sk.split(NONCE_SK_SEPARATOR);

    const decryptedSK = nacl.secretbox.open(
      base64ToUint8Array(secretbox),
      base64ToUint8Array(nonce),
      stringToUint8Array(password)
    );

    if (!decryptedSK) throw new Error("Decryption Error");

    return options?.stringify ? uint8ArrayToString(decryptedSK) : decryptedSK;
  } catch (error) {
    throw new Error("Decryption Error");
  }
}

/**
 * Decrypts Account Backup
 * returns null in case of decryption error
 *
 * @param {string} backup stringified (Uint8Array[nonce] + uint8Array[secretbox])
 * @param {Uint8Array} key / 32 bytes long Uint8Array
 * @returns {Uint8Array | null}
 */
function decryptAccountBackup(backup: string, key: Uint8Array): Uint8Array | null {
  const encryptedContent = stringBytesToUint8Array(backup);
  const [nonce, secretbox] = [
    encryptedContent.slice(0, nacl.secretbox.nonceLength),
    encryptedContent.slice(nacl.secretbox.nonceLength)
  ];

  return nacl.secretbox.open(secretbox, nonce, key);
}

export {encryptSK, decryptSK, hashPassword, generateNonce, decryptAccountBackup};
