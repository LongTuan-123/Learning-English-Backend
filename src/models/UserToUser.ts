import mongoose from 'mongoose'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export type MessageType = {
  Message: { Text: string }
  Users: unknown
  Sender: mongoose.Schema.Types.ObjectId
}

const MessageSchema = new mongoose.Schema(
  {
    Users: Array,
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
    collection: 'Message',
  },
)

export const MessageModel = mongoose.model<MessageType>('Message', MessageSchema)
