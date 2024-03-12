import {Buffer} from "buffer";
import {
  decryptMessage,
  deriveUserKey,
  encryptMessage,
  generateRSAKeyPair,
  getTenant,
  getUserSeed,
  newTenant,
  newUserSeed,
  receiveTenantKey,
  sendTenantKey
} from "../lib/Utils.ts";
import {BIP32Interface} from "bip32";

// Server-side:
// User: id, email, BIP39 seed fingerprint, RSA public key, RSA key pair encrypted with the "m/0/0" derived user key.
// UserTenant: user id, tenant id, counter, tenant AES-GCM key encrypted with the "m/1/counter" derived user key.
// Book: tenant id, title
// BookRecord: book id, data encrypted with the tenant's AES-GCM key.

// Browser-side (everything except the BIP32 seed must be recoverable from the server):
// User: BIP32 seed, RSA key pair.
// UserTenant records.

// An unauthenticated client can:
// - Send an email address to the server to cause its encrypted RSA key pair to be send to the user's
//   email address. The encrypted key can be pasted by the user to recover the RSA key pair.
// - Request a challenge from the server to authenticate (see below).
//
// The client can authenticate by passing a challenge as follows:
// - Obtain a challenge from the server by sending the user's email address;
//   the server generates a random challenge, stores its hash, and returns the challenge encrypted with the
//   user's public key.
// - To pass the challenge, the browser must decrypt the challenge using the RSA key pair, hash the challenge,
//   and send the hash to the server.
//
// An authenticated client can:
// - retrieve its user_tenant records
// - retrieve any user's RSA public key by sending the user's email address
// - share access to a tenant with another user, by providing the tenant id, recipient email address,
//   and tenant key encrypted with the recipient's public key.
// - revoke access to a tenant from another user, by providing the tenant id and recipient email address.

// Generate a new user seed if one is not already stored.
let userSeed: BIP32Interface | undefined;
const savedUserSeed = localStorage.getItem("seed");
if (!savedUserSeed) {
  const { mnemonic, seed } = newUserSeed();
  console.log(`mnemonic: ${mnemonic}`);
  localStorage.setItem("seed", seed.toString("hex"));
  userSeed = getUserSeed(seed);
} else {
  userSeed = getUserSeed(Buffer.from(savedUserSeed, "hex"));
}
console.log(`Seed fingerprint: ${userSeed.fingerprint.toString("hex")}`)

let tenantKey: CryptoKey | undefined;
let tenant = localStorage.getItem("tenant");
if (!tenant) {
  // Create a new tenant key.
  console.log("Creating new tenant key");
  const counter = 1; // This should be generated by the server as 1 + max(user_tenants.counter) for the user.
  const path = `m/1/${counter}`;
  console.log(`Path: ${path}`);
  const userKey = await deriveUserKey(userSeed, path);
  const { key, encryptedKey } = await newTenant(userKey);
  console.log(`New User-Tenant key: ${encryptedKey.toString("hex")}`);
  localStorage.setItem("tenant", `${counter}.${encryptedKey.toString("hex")}`);
  tenantKey = key;
} else {
  // Retrieve the tenant key.
  console.log(`Retrieving tenant key from userSeed ${userSeed.fingerprint.toString("hex")}`);
  const parts = tenant.split(".");
  const path = `m/1/${parts[0]}`;
  const encryptedKey = parts[1];
  console.log(`Path: ${path}, Encrypted key: ${encryptedKey}`);
  const userKey = await deriveUserKey(userSeed, path);
  console.log(`unwrapping tenant key`);
  tenantKey = await getTenant(userKey, Buffer.from(encryptedKey, "hex"));
  console.log(`tenant key retrieved`);
}

console.log(`Tenant key: ${tenantKey}`);
if (tenantKey) {
  const message = localStorage.getItem("message");
  if (!message) {
    // Store a message using the tenant key
    console.log(`Storing message`);
    const message = await encryptMessage(tenantKey, "Hello, world!");
    localStorage.setItem("message", message.toString("hex"));
    console.log(`Message stored`);
  } else {
    // Retrieve and print the message using the tenant key
    console.log(`Retrieving message`);
    const clearText = await decryptMessage(tenantKey, Buffer.from(message, "hex"));
    console.log(`Message: ${clearText}`);
  }

  console.log(`Sharing tenant key with Bob...`)
  const bobKeyPair = await generateRSAKeyPair();

  const tenantKeyPacket = await sendTenantKey(bobKeyPair.publicKey, tenantKey);
  console.log(`Tenant key packet: ${tenantKeyPacket.toString("hex")}`)

  // Decrypt the tenant key packet
  const decryptedTenantKey = await receiveTenantKey(bobKeyPair.privateKey, tenantKeyPacket);
  console.log(`Decrypted tenant key: ${decryptedTenantKey}`);
}