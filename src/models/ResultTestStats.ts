import mongoose from 'mongoose'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export type ResultTestStats = {
  Day: number
  Amount: string
  CreatedAt: number
  UpdatedAt: number
}

const ResultTestAmountSchema = new mongoose.Schema(
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
    collection: 'ResultTestStats',
    versionKey: false,
  },
)

export const ResultTestStatsModel = mongoose.model<ResultTestStats>('ResultTestStats', ResultTestAmountSchema)
