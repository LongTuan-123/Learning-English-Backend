import mongoose from 'mongoose'

export type ReadingType = {
  Title: string
  ImageTitle: string
  Description: string
  CreatedAt: number
  UpdatedAt: number
}

const ReadingSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    ImageTitle: {
      type: String,
      required: true,
    },
    Description: {
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
  },
  {
    collection: 'Reading',
    versionKey: false,
  },
)

export const ReadingModel = mongoose.model<ReadingType>('Reading', ReadingSchema)
