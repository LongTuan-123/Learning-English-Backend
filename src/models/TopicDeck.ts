import mongoose from 'mongoose'

export type TopicDeckType = {
  TopicName: string
  UserId: String
  CreatedAt: number
  UpdatedAt: number
}

const TopicDeckSchema = new mongoose.Schema(
  {
    TopicName: {
      type: String,
      required: true,
    },
    UserId: {
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
    collection: 'TopicDeck',
    versionKey: false,
  },
)

export const TopicDeckModel = mongoose.model<TopicDeckType>('TopicDeck', TopicDeckSchema)
