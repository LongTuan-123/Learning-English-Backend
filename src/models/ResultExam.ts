import mongoose from 'mongoose'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export type ResultExamType = {
  ResultExam: string
  Topic: string
  User: mongoose.Schema.Types.ObjectId
  CreatedAt: number
  UpdatedAt: number
}

const ResultExamSchema = new mongoose.Schema(
  {
    ResultExam: {
      type: String,
      require: true,
    },
    Topic: {
      type: String,
      require: true,
    },
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
    collection: 'ResultExam',
  },
)

export const ResultExamModel = mongoose.model<ResultExamType>('ResultExam', ResultExamSchema)
