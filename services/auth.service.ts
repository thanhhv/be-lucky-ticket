import { ethers } from "ethers";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { NonceModel } from "../models/nonce.model";

export async function createNonceMessage(
  address: string
): Promise<{ message: string; nonce: string }> {
  const nonce = uuidv4();

  await NonceModel.create({
    wallet: address.toLowerCase(),
    nonce,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    used: false,
  });

  const message = `
Welcome to ${process.env.APP_NAME}!
Click to sign in and accept the Terms of Service.

This request will not trigger a blockchain transaction or cost any gas fees.

Wallet address: ${address}
Nonce: ${nonce}
`.trim();

  return { message, nonce };
}

export async function verifySignature(
  address: string,
  message: string,
  signature: string
): Promise<{ success: boolean; reason?: string }> {
  const recoveredAddress = ethers.utils.verifyMessage(message, signature);

  if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
    return { success: false, reason: "Signature does not match address" };
  }

  // Parse nonce từ message
  const match = message.match(/Nonce:\s([a-zA-Z0-9-]+)/);
  if (!match || !match[1]) {
    return { success: false, reason: "Nonce not found in message" };
  }

  const nonce = match[1];

  const record = await NonceModel.findOne({
    wallet: address.toLowerCase(),
    nonce,
  }).lean();

  if (!record) {
    return { success: false, reason: "Nonce not found in database" };
  }

  if (record.used) {
    return { success: false, reason: "Nonce has already been used" };
  }

  if (record.expiresAt.getTime() < Date.now()) {
    return { success: false, reason: "Nonce has expired" };
  }

  record.used = true;
  await record.save();

  return { success: true };
}

export function generateJwt(address: string): string {
  const JWT_SECRET = process.env.JWT_SECRET as string; 
  return jwt.sign(
    { address },
    JWT_SECRET,
    { expiresIn: "10d" } // expires in 10 days
  );
}
