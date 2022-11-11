import mongoose from 'mongoose'

export type UserType = {
  Email: string
  HashedPassword: string
  CreatedAt: number
  UpdatedAt: number
  DeleteAt: number
  OtpCode: number
  IsActivated: boolean
  Role: number
}

const UserSchema = new mongoose.Schema(
  {
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    HashedPassword: {
      type: String,
      required: true,
    },
    CreatedAt: {
      type: Number,
      default: Math.floor(new Date().getTime() / 1000),
    },
    UpdatedAt: {
      type: Number,
      default: Math.floor(new Date().getTime() / 1000),
    },
    DeletedAt: {
      type: Number,
      default: 0,
    },
    OtpCode: {
      type: Number,
      default: 0,
    },
    IsActivated: {
      type: Boolean,
      default: false,
    },
    Role: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: 'User',
    versionKey: false,
  },
)

export const UserModel = mongoose.model<UserType>('User', UserSchema)
