import mongoose from 'mongoose'
import { CARD_TYPES } from '../types/card'

export type CardType = {
  Word: string
  Phonetic: string
  Audio: string
  Meanings: string
  UserId: mongoose.Schema.Types.ObjectId
  TopicName: string
  Level: CARD_TYPES
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
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    TopicName: {
      type: String,
      required: true,
    },
    Level: {
      type: String,
      require: true,
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
