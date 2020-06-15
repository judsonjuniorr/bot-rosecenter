import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  identifier: string;
  discordID?: string;
  ip?: string;
}

const userSchema: Schema = new Schema(
  {
    identifier: { type: String, required: true, unique: true },
    ip: { type: String, required: false },
    discordID: { type: String, required: false },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>('User', userSchema);
