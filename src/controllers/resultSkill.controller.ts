import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { SpeakingModel } from '../models/Speaking'
import { ResultSkillModel } from '../models/ResultSkill'

dayjs.extend(utc)

const DEFAULT_START_PAGE = 1
const DEFAULT_ITEM_PER_PAGE = 10

export const getResultSkill = async (req, res) => {
  const queryString = req.query

  const startPage = Number((queryString.page || DEFAULT_START_PAGE) - 1)
  const limit = Number(queryString.limit || DEFAULT_ITEM_PER_PAGE)
  const topicName = queryString.topicName

  if (startPage < 0) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid start page option' })
    return
  }

  if (!topicName) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid topic name' })
    return
  }

  if (Number.isNaN(limit)) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid limit option' })
    return
  }

  try {
    const totalRecords = await ResultSkillModel.countDocuments({
      TopicName: topicName,
    })
    const totalPages = Math.ceil(totalRecords / limit)

    const speaking = await ResultSkillModel.find(
      {
        TopicName: topicName,
      },
      null,
      { skip: startPage * limit, limit },
    )
      .sort({ CreatedAt: -1 })
      .lean()
      .transform((docs) =>
        docs.map((doc) => ({
          id: doc._id,
          resultSkill: doc.ResultSkill,
          topic: doc.Topic,
          title: doc.Title,
          skills: doc.Skills,
          day: doc.CreatedAt,
        })),
      )

    res.status(StatusCodes.OK).json({
      success: true,
      data: speaking,
      pagination: { startPage: startPage + 1, limit: Number(limit), totalPages, totalRecords },
    })
  } catch (error) {
    console.log('[create post] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const addResultSkill = async (req, res) => {
  try {
    const { result, topic, title, user_id, skill } = req.body

    if (!result) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid audio question' })
      return
    }

    if (!topic) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid topic name' })
      return
    }

    if (!skill) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid skill' })
      return
    }

    if (!title) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid title' })
      return
    }

    const currentTimestamp = dayjs.utc().unix()

    const response = await ResultSkillModel.create({
      ResultSkill: result,
      Topic: topic,
      Title: title,
      User: user_id,
      Skills: skill,
      CreatedAt: currentTimestamp,
      UpdatedAt: currentTimestamp,
    })

    if (response) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: `You create ${skill} successfully` })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: `You create ${skill} fail` })
    }
  } catch (error) {
    console.log('[Add result skill] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const deleteResultSkill = async (req, res) => {
  try {
    const { result_id } = req.body

    if (!result_id) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Speaking Id is required' })
      return
    }

    const response = await ResultSkillModel.findByIdAndDelete(result_id).catch(() => {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You delete the speaking fail' })
    })

    if (response) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You delete the speaking successfully' })
    }
  } catch (error) {
    console.log('[create post] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const updateResultSkill = async (req, res) => {
  try {
    const { result, topic, title, skill, result_id } = req.body

    if (!result) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid audio question' })
      return
    }

    if (!topic) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid topic name' })
      return
    }

    if (!skill) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid skill' })
      return
    }

    if (!title) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid title' })
      return
    }
    const currentTimestamp = dayjs.utc().unix()

    SpeakingModel.findByIdAndUpdate(result_id, {
      ResultSkill: result,
      Topic: topic,
      Title: title,
      Skills: skill,
      UpdatedAt: currentTimestamp,
    }).catch(() => {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: `You update the ${skill} fail` })
      return
    })

    res.status(StatusCodes.OK).json({ success: true, data: null, message: `You update the ${skill} successfully` })
  } catch (error) {
    console.log('[update result skill] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}
