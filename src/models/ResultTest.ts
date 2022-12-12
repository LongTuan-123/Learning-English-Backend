import mongoose from 'mongoose'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { SKILLS } from '../types/common'

dayjs.extend(utc)

export type ResultTestType = {
  ResultTest: string
  Topic: string
  User: mongoose.Schema.Types.ObjectId
  Skills: SKILLS
  CreatedAt: number
  UpdatedAt: number
}

const ResultTestSchema = new mongoose.Schema(
  {
    ResultTest: {
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
    Skills: {
      type: String,
      require: true,
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
    collection: 'ResultTest',
  },
)

export const ResultTestModel = mongoose.model<ResultTestType>('ResultTest', ResultTestSchema)
