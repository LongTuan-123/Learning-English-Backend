import mongoose from 'mongoose'

export type RandomCardType = {
  NumberOfWord: number
  isActivated: boolean
  UserId: mongoose.Schema.Types.ObjectId
  Topic: string
  Level: string
  CreatedAt: number
  UpdatedAt: number
}

const RandomCardSchema = new mongoose.Schema(
  {
    NumberOfWord: {
      type: Number,
      required: true,
    },
    Level: {
      type: String,
      require: true,
    },
    Topic: {
      type: String,
      require: true,
    },
    isActivated: {
      type: Boolean,
      required: true,
    },
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
  },
  {
    collection: 'RandomCard',
    versionKey: false,
  },
)

export const RandomCardModel = mongoose.model<RandomCardType>('RandomCard', RandomCardSchema)
