import mongoose from 'mongoose'

export type SpeakingType = {
  Question: string
  TopicName: string
  Part: number
  ExpiredTimeSpeak: number
  CreatedAt: number
  UpdatedAt: number
}

const SpeakingSchema = new mongoose.Schema(
  {
    Question: {
      type: String,
      required: true,
    },
    TopicName: {
      type: String,
      required: true,
    },
    Part: {
      type: Number,
      require: true,
    },
    ExpiredTimeSpeak: {
      type: Number,
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
    collection: 'Speaking',
    versionKey: false,
  },
)

export const SpeakingModel = mongoose.model<SpeakingType>('Speaking', SpeakingSchema)
