import mongoose from 'mongoose'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export type PostStats = {
  Day: number
  Amount: string
  CreatedAt: number
  UpdatedAt: number
}

const PostAmountSchema = new mongoose.Schema(
  {
    Day: {
      type: Number,
    },
    Amount: {
      type: Number,
    },
    CreatedAt: {
      type: Number,
      default: dayjs.utc().unix(),
    },
    UpdatedAt: {
      type: Number,
      default: dayjs.utc().unix(),
    },
  },
  {
    collection: 'PostStats',
    versionKey: false,
  },
)

export const PostStatsModel = mongoose.model<PostStats>('PostStats', PostAmountSchema)
