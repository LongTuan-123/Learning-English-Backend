import mongoose from 'mongoose'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { SKILLS } from '../types/common'

dayjs.extend(utc)

export type ResultSkillType = {
  ResultSkill: string
  Topic: string
  Title: string
  User: mongoose.Schema.Types.ObjectId
  Skills: SKILLS
  CreatedAt: number
  UpdatedAt: number
}

const ResultSkillSchema = new mongoose.Schema(
  {
    ResultSkill: {
      type: String,
      require: true,
    },
    Topic: {
      type: String,
      require: true,
    },
    Title: {
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
    collection: 'ResultSkill',
  },
)

export const ResultSkillModel = mongoose.model<ResultSkillType>('ResultSkill', ResultSkillSchema)
