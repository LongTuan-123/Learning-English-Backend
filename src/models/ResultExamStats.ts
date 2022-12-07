import mongoose from 'mongoose'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export type ResultExamStats = {
  Day: number
  Amount: string
  CreatedAt: number
  UpdatedAt: number
}

const ResultExamAmountSchema = new mongoose.Schema(
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
    collection: 'ResultExamStats',
    versionKey: false,
  },
)

export const ResultExamStatsModel = mongoose.model<ResultExamStats>('ResultExamStats', ResultExamAmountSchema)
