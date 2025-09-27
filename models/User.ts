import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'superadmin' | 'coach' | 'player';
  phone: string;
  otpCode?: string;
  otpExpires?: Date;
  otpAttempts?: number;
  isActive: boolean;
  teamId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'coach', 'player'], default: 'player' },
  phone: { type: String, required: true },
  otpCode: { type: String },
  otpExpires: { type: Date },
  otpAttempts: { type: Number, default: 0 },
  isActive: { type: Boolean, default: false },
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);
