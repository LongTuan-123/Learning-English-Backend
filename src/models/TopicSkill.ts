import mongoose from 'mongoose'
import { SKILLS } from '../types/common'

export type TopicSkillsType = {
  TopicName: string
  Skills: SKILLS
  CreatedAt: number
  UpdatedAt: number
}

const TopicSkillsSchema = new mongoose.Schema(
  {
    TopicName: {
      type: String,
      required: true,
    },
    Skills: {
      type: String,
      require: true,
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
    collection: 'TopicSkills',
    versionKey: false,
  },
)

export const TopicSkillsModel = mongoose.model<TopicSkillsType>('TopicSkills', TopicSkillsSchema)
