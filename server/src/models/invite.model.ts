import mongoose from 'mongoose';
import { USER_ROLES, type UserRole } from './user.model.js';

export const INVITE_ROLES: readonly InviteRole[] = USER_ROLES.filter(
  (role): role is InviteRole => role !== 'admin',
);
export type InviteRole = Exclude<UserRole, 'admin'>;

const inviteSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: INVITE_ROLES,
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export const Invite = mongoose.model('Invite', inviteSchema);
export type InviteDoc = mongoose.InferSchemaType<typeof inviteSchema>;
