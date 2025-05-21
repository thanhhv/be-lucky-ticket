import mongoose, { Document, Schema } from 'mongoose';

export interface INonce extends Document {
  wallet: string;
  nonce: string;
  expiresAt: Date;
  used: boolean;
}

const NonceSchema = new Schema<INonce>({
  wallet: { type: String, required: true, lowercase: true },
  nonce: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false }
}, { timestamps: true });

NonceSchema.index({ wallet: 1, nonce: 1, used: 1 });
NonceSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 604800 }); // 7 days

export const NonceModel = mongoose.model<INonce>('Nonce', NonceSchema);
