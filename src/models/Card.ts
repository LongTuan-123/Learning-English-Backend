import mongoose from 'mongoose'

export type CardType = {
  Word: string
  Phonetic: string
  Audio: string
  Meanings: string
  TopicId: string
  CreatedAt: number
  UpdatedAt: number
}

const CardSchema = new mongoose.Schema(
  {
    Word: {
      type: String,
      required: true,
    },
    Phonetic: {
      type: String,
      required: true,
    },
    Audio: {
      type: String,
      require: false,
    },
    Meanings: {
      type: String,
      require: true,
    },
    TopicId: {
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
    collection: 'Card',
    versionKey: false,
  },
)

export const CardModel = mongoose.model<CardType>('Card', CardSchema)
