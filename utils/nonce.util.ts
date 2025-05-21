import { v4 as uuidv4 } from 'uuid';

type NonceData = {
  nonce: string;
  expiresAt: number;
};

const nonceStore = new Map<string, NonceData>();

export function generateNonce(): string {
  return uuidv4();
}

export function saveNonce(address: string, nonce: string): void {
  const lowerAddress = address.toLowerCase();
  nonceStore.set(lowerAddress, {
    nonce,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });
}

export function getStoredNonce(address: string): NonceData | undefined {
  return nonceStore.get(address.toLowerCase());
}
