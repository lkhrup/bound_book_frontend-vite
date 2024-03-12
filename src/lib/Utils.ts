import * as bip39 from "bip39";
import * as ecc from "tiny-secp256k1";
import type {BIP32Interface} from "bip32";
import BIP32Factory from "bip32";
import {Buffer} from "buffer";

const tenantKeyAlgorithm: AesKeyGenParams = { name: "AES-GCM", length: 256, };

const bip32 = BIP32Factory(ecc);

export function newUserSeed(): { mnemonic: string, seed: Buffer } {

  const mnemonic = bip39.generateMnemonic();
  // Validate the BIP39 mnemonic phrase
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Invalid BIP39 mnemonic phrase.");
  }
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  return { mnemonic, seed };
}

export function getUserSeed(seed: Buffer): BIP32Interface {
  return bip32.fromSeed(seed);
}

export async function deriveUserKey(seed: BIP32Interface, path: string) {
  const keyData = seed.derivePath(path).privateKey;
  if (!keyData) {
    throw new Error(`Error deriving key from seed at path ${path}`);
  }
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    tenantKeyAlgorithm,
    false,
    ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
  );
}

// newTenant generates a symmetric key pair for the tenant,
// and encrypts the key with the user's public key.
// The CryptoKey and the encrypted key are returned.
export async function newTenant(userKey: CryptoKey) {
  // Generate a new tenant key
  const tenantKey = await window.crypto.subtle.generateKey(
    tenantKeyAlgorithm,
    true, // extractable: can be exported
    ["encrypt", "decrypt"]
  );
  // Wrap the tenant key
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const wrappedKeyData = await crypto.subtle.wrapKey(
    "raw", tenantKey, userKey, { name: "AES-GCM", iv, label: Buffer.from("tenantKey") }
  );
  const encryptedKey = Buffer.concat([Buffer.from(iv), Buffer.from(wrappedKeyData)]);
  return { key: tenantKey, encryptedKey };
}

export async function getTenant(userKey: CryptoKey, encryptedKey: Buffer) {
  // Split IV and encrypted data
  const iv = encryptedKey.subarray(0, 12);
  const encryptedKeyData = encryptedKey.subarray(12);
  // Unwrap the tenant key
  console.log(`unwrapping key`);
  return await crypto.subtle.unwrapKey(
    "raw", encryptedKeyData, userKey, { name: "AES-GCM", iv, label: Buffer.from("tenantKey") },
    tenantKeyAlgorithm,
    true, // extractable: can be exported
    ["encrypt", "decrypt"]
  );
}

export async function encryptMessage(tenantKey: CryptoKey, message: string) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedMessage = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    tenantKey,
    Buffer.from(message)
  );
  return Buffer.concat([Buffer.from(iv), Buffer.from(encryptedMessage)]);
}

export async function decryptMessage(tenantKey: CryptoKey, encryptedMessage: Buffer) {
  const iv = encryptedMessage.subarray(0, 12);
  const encryptedMessageData = encryptedMessage.subarray(12);
  const decryptedMessage = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    tenantKey,
    encryptedMessageData
  );
  return Buffer.from(decryptedMessage).toString();
}

export async function generateRSAKeyPair() {
  return await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: "SHA-256"
    },
    true,
    ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
  );
}

export async function sendTenantKey(publicKey: CryptoKey, tenantKey: CryptoKey) {
  const packet = await crypto.subtle.wrapKey(
    "raw", tenantKey, publicKey, { name: "RSA-OAEP", label: Buffer.from("tenantKey") }
  );
  return Buffer.from(packet);
}

export async function receiveTenantKey(privateKey: CryptoKey, packet: Buffer) {
  return await crypto.subtle.unwrapKey(
    "raw", packet, privateKey, { name: "RSA-OAEP", label: Buffer.from("tenantKey") },
    tenantKeyAlgorithm,
    true, // extractable: can be exported
    ["encrypt", "decrypt"]
  );
}
