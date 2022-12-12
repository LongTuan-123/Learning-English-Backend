import mongoose from 'mongoose'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export type MessageType = {
  Message: { Text: string; Type: string }
  Users: unknown
  Sender: mongoose.Schema.Types.ObjectId
}

const MessageSchema = new mongoose.Schema(
  {
    Message: {
      Text: {
        type: String,
        required: true,
      },
      Type: {
        type: String,
        required: true,
      },
    },
    Users: Array,
    Sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    collection: 'Message',
    timestamps: true,
  },
)

export const MessageModel = mongoose.model<MessageType>('Message', MessageSchema)
