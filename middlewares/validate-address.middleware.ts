import { ethers } from "ethers";
import { Request, Response, NextFunction } from "express";
import { NonceModel } from "../models/nonce.model";

export const validateAddressQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const address = req.query.address as string;

  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address || "");
  if (!address || !isValidAddress) {
    res.status(400).json({ error: "Invalid or missing address" });
  } else {
    next();
  }
};

export const verifySignatureMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { address, message, signature } = req.body;

  if (!address || !message || !signature) {
    return res
      .status(400)
      .json({ error: "Missing address, message, or signature" });
  }

  try {
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res
        .status(401)
        .json({ error: "Signature does not match address" });
    }

    const match = message.match(/Nonce:\s([a-zA-Z0-9-]+)/);
    const nonce = match?.[1];
    if (!nonce)
      return res.status(400).json({ error: "Nonce not found in message" });

    const record = await NonceModel.findOne({
      wallet: address.toLowerCase(),
      nonce,
    });
    if (!record) return res.status(401).json({ error: "Nonce not found" });
    if (record.used)
      return res.status(401).json({ error: "Nonce already used" });
    if (record.expiresAt.getTime() < Date.now())
      return res.status(401).json({ error: "Nonce expired" });

    // Mark nonce as used
    record.used = true;
    await record.save();

    // Attach to request
    (req as any).walletAddress = address;
    next();
  } catch (err) {
    console.error("Verify middleware error:", err);
    return res
      .status(500)
      .json({ error: "Internal error during signature verification" });
  }
};
