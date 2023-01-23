import mongoose from 'mongoose'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export type MessageGroupType = {
  Message: { Text: string; Type: string }
  Users: Array<string>
  From: string
  To: string
}

const MessageGroupSchema = new mongoose.Schema(
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
    From: {
      type: String,
      required: true,
    },
    To: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'MessageGroup',
    timestamps: true,
  },
)

export const MessageGroupModel = mongoose.model<MessageGroupType>('MessageGroup', MessageGroupSchema)
