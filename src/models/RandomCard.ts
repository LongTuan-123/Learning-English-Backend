import mongoose from 'mongoose'

export type RandomCardType = {
  NumberOfWord: number
  isActivated: boolean
  UserId: string
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
      type: String,
      require: false,
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
