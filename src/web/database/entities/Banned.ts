import mongoose, { Schema, Document } from 'mongoose';

export interface IBanned extends Document {
  discordID: string;
  identifier?: string;
}

const bannedSchema: Schema = new Schema(
  {
    discordID: { type: String, required: true },
    identifier: { type: String, required: false },
  },
  { timestamps: true },
);

export default mongoose.model<IBanned>('Banned', bannedSchema);
