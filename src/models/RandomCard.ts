import mongoose from 'mongoose'

export type RandomCardType = {
  NumberOfWord: number
  isActivated: boolean
  UserId: string
  CreatedAt: number
  UpdatedAt: number
}

const RandomCardSchema = new mongoose.Schema(
  {
    NumberOfWord: {
      type: Number,
      required: true,
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
