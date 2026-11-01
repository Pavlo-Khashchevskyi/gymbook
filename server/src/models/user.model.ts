import mongoose from 'mongoose';

export const USER_ROLES = ['admin', 'trainer', 'client'] as const;

export type UserRole = (typeof USER_ROLES)[number];

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model('User', userSchema);
export type UserDoc = mongoose.InferSchemaType<typeof userSchema>;
