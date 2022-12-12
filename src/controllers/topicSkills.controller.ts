import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { TopicSkillsModel } from '../models/TopicSkill'

dayjs.extend(utc)

export const index = async (req, res) => {
  try {
    const { skills } = req.query

    if (!skills) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Skills' })
      return
    }

    const topics = await TopicSkillsModel.find(
      {
        Skills: skills,
      },
      null,
      {},
    )
      .lean()
      .transform((docs) =>
        docs.map((doc) => ({
          id: doc._id,
          topicName: doc.TopicName,
          skills: doc.Skills,
          day: doc.CreatedAt,
        })),
      )

    res.status(StatusCodes.OK).json({
      success: true,
      data: topics,
      message: null,
    })
  } catch (error) {
    console.log('[topic skills] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const create = async (req, res) => {
  try {
    const { topicName, skill } = req.body

    if (!topicName) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Topic Name' })
      return
    }

    const currentTimestamp = dayjs.utc().unix()

    const createTopicSkills = await TopicSkillsModel.create({
      TopicName: topicName,
      Skills: skill,
      CreatedAt: currentTimestamp,
      UpdatedAt: currentTimestamp,
    })

    if (createTopicSkills) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You create topic deck successfully' })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You create topic deck fail' })
    }
  } catch (error) {
    console.log('[create topic skills] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const deleteTopicDeck = async (req, res) => {
  try {
    const { topicId } = req.body

    if (!topicId) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Topic Id' })
      return
    }

    const response = await TopicSkillsModel.findByIdAndDelete(topicId)

    if (response) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You delete topic deck successfully' })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You delete topic deck fail' })
    }
  } catch (error) {
    console.log('[delete topic skills] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}
