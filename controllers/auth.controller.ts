import { Request, Response } from "express";
import { createNonceMessage, generateJwt, } from "../services/auth.service";

export async function getSignMessage (req: Request, res: Response): Promise<any> {
  const address = req.query.address as string;

  try {
    const { message } = await createNonceMessage(address);
    return res.json({ address, message });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create sign message' });
  }
};

export const issueTokenAfterVerify = (req: Request, res: Response) => {
  const address = (req as any).walletAddress as string;

  if (!address) {
    return res.status(400).json({ error: 'Wallet address not found in request context' });
  }

  const token = generateJwt(address);
  return res.json({ token });
};