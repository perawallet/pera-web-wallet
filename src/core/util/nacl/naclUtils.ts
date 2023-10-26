import nacl from "tweetnacl";
import scrypt from "scrypt-async";
import * as bip39 from "bip39";

import {
  uint8ArrayToBase64,
  base64ToUint8Array,
  stringToUint8Array,
  uint8ArrayToString,
  stringBytesToUint8Array
} from "../blob/blobUtils";
import {ALGORAND_MNEMONIC_WORDLIST} from "../algosdk/algosdkUtils";
import {ARCStandardMobileSyncAccount} from "../../../account/accountModels";

const NONCE_SK_SEPARATOR = "**";
const PASSWORD_SALT = "7376f7d53ab818f03ba381cedad3940b";

export const ALGORAND_SECURE_BACKUP_KEY_SIZE = 16;

function generateKey() {
  return nacl.randomBytes(nacl.secretbox.keyLength);
}

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
 * @param {string} backup base64<Uint8Array[nonce] + uint8Array[secretbox]>
 * @param {Uint8Array} key / 32 bytes long Uint8Array
 * @returns {Uint8Array | null}
 */
function decryptAccountBackup(backup: string, key: Uint8Array): Uint8Array | null {
  let encryptedContent: Uint8Array;

  // in import from mobile feature
  // old mobile versions will send stringified bytes instead of base64
  // base64 private_key exchange is now standard for new versions acc. to ARC-35
  try {
    encryptedContent = base64ToUint8Array(backup);
  } catch (e) {
    encryptedContent = stringBytesToUint8Array(backup);
  }

  const [nonce, secretbox] = [
    encryptedContent.slice(0, nacl.secretbox.nonceLength),
    encryptedContent.slice(nacl.secretbox.nonceLength)
  ];

  return nacl.secretbox.open(secretbox, nonce, key);
}

/**
 * Encrypts Account Backup
 * returns null in case of encryption error
 *
 * @param {string} backup stringified JSON
 * @param {Uint8Array} key / 32 bytes long Uint8Array
 * @returns {Uint8Array | null}
 */
function encryptAccountBackup(backup: string, key: Uint8Array): Uint8Array | null {
  const secretbox = stringToUint8Array(backup);
  const nonce = generateNonce();

  return new Uint8Array([...nonce, ...nacl.secretbox(secretbox, nonce, key)]);
}

async function hmacSha256(message: Uint8Array, key: Uint8Array) {
  const hmacKey = await crypto.subtle.importKey(
    "raw",
    key,
    {name: "HMAC", hash: "SHA-256"},
    true,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", hmacKey, message);

  return new Uint8Array(signature);
}

/**
 * Verifies the hash of hmacSha256 method
 *  
 * @param {Object} hmacSha256Params - Params for verifying hmacSha256 output
 * @param {string} hmacSha256.message - The unhashed version of the message 
 * @param {string} hmacSha256.key - The key used to hash the message
 * @param {string} hmacSha256.signature - The hash/signature generated using hmacSha256 method
 *
 * Example:     
 * const message = "message";
 * const secretKey = "secret key";
 * const hash = await hmacSha256(
 *   stringToUint8Array(message),
 *   stringToUint8Array(secretKey)
 * );

 * const isHashVerified = await hmacSha256Verify({
 *   message: stringToUint8Array(message),
 *   key: stringToUint8Array(secretKey),
 *   signature: hash
 * });

 * console.log(isHashVerified);
 *
 */
async function hmacSha256Verify({
  message,
  key,
  signature
}: {
  message: Uint8Array;
  key: Uint8Array;
  signature: Uint8Array;
}): Promise<boolean> {
  const hmacKey = await crypto.subtle.importKey(
    "raw",
    key,
    {name: "HMAC", hash: "SHA-256"},
    true,
    ["verify"]
  );

  return window.crypto.subtle.verify("HMAC", hmacKey, signature, message);
}

function generateASBKeyPassphrase() {
  const secretKey = nacl.randomBytes(ALGORAND_SECURE_BACKUP_KEY_SIZE);

  return bip39.entropyToMnemonic(Buffer.from(secretKey));
}

async function encryptAlgorandSecureBackup(
  backup: {
    device_id: string;
    provider_name: "Pera Wallet";
    accounts: ARCStandardMobileSyncAccount[];
  },
  mnemonic: string
): Promise<string> {
  const secretKey = new Uint8Array(Buffer.from(bip39.mnemonicToEntropy(mnemonic), "hex"));
  const derivedKey = await hmacSha256(
    secretKey,
    stringToUint8Array("Algorand export 1.0")
  );

  return uint8ArrayToBase64(encryptAccountBackup(JSON.stringify(backup), derivedKey)!);
}

async function decryptAlgorandSecureBackup<T extends Record<string, string>>({
  cipher,
  mnemonic
}: {
  cipher: string;
  mnemonic: string;
}): Promise<T | T[]> {
  const secretKey = new Uint8Array(
    Buffer.from(bip39.mnemonicToEntropy(mnemonic, ALGORAND_MNEMONIC_WORDLIST), "hex")
  );
  // const secretKey = new Uint8Array(Buffer.from(bip39.mnemonicToEntropy(mnemonic), "hex"));
  const derivedKey = await hmacSha256(
    secretKey,
    stringToUint8Array("Algorand export 1.0")
  );
  const encryptedBackup = decryptAccountBackup(cipher, derivedKey);

  return JSON.parse(uint8ArrayToString(encryptedBackup!));
}

export {
  encryptSK,
  decryptSK,
  hashPassword,
  generateNonce,
  generateKey,
  decryptAccountBackup,
  encryptAccountBackup,
  hmacSha256,
  hmacSha256Verify,
  generateASBKeyPassphrase,
  encryptAlgorandSecureBackup,
  decryptAlgorandSecureBackup
};
