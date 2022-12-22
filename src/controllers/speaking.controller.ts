import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { SpeakingModel } from '../models/Speaking'

dayjs.extend(utc)

const DEFAULT_START_PAGE = 1
const DEFAULT_ITEM_PER_PAGE = 10

export const getSpeaking = async (req, res) => {
  const queryString = req.query

  const startPage = Number((queryString.page || DEFAULT_START_PAGE) - 1)
  const limit = Number(queryString.limit || DEFAULT_ITEM_PER_PAGE)
  const parts = queryString.parts || '1,2,3'
  const topicName = queryString.topicName

  const partList = parts.split(',')

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
    const totalRecords = await SpeakingModel.countDocuments({
      TopicName: topicName,
    })
    const totalPages = Math.ceil(totalRecords / limit)

    const speaking = await SpeakingModel.find(
      {
        TopicName: topicName,
        $or: partList.map((part: string) => ({
          Part: part,
        })),
      },
      null,
      { skip: startPage * limit, limit },
    )
      .sort({ CreatedAt: -1 })
      .lean()
      .transform((docs) =>
        docs.map((doc) => ({
          id: doc._id,
          question: doc.Question,
          expiredTime: doc.ExpiredTimeSpeak,
          topicName: doc.TopicName,
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

export const addSpeakingFile = async (req, res) => {
  try {
    const { question, expiredTime, part, topicName } = req.body

    if (!question) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid question' })
      return
    }

    if (!expiredTime) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Expired Time' })
      return
    }

    if (!topicName) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid topic name' })
      return
    }

    if (!part) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid part' })
      return
    }

    const currentTimestamp = dayjs.utc().unix()

    const response = await SpeakingModel.create({
      Question: question,
      ExpiredTimeSpeak: expiredTime,
      Part: part,
      TopicName: topicName,
      CreatedAt: currentTimestamp,
      UpdatedAt: currentTimestamp,
    })

    if (response) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You create speaking successfully' })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You create speaking fail' })
    }
  } catch (error) {
    console.log('[Add speaking] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const deleteSpeaking = async (req, res) => {
  try {
    const { speaking_id } = req.body

    if (!speaking_id) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Speaking Id is required' })
      return
    }

    const response = await SpeakingModel.findByIdAndDelete(speaking_id).catch(() => {
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

export const updatePost = async (req, res) => {
  try {
    const { question, expiredTime, part, topicName, speaking_id } = req.body

    if (!question) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid question' })
      return
    }

    if (!expiredTime) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Expired Time' })
      return
    }

    if (!topicName) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid topic name' })
      return
    }

    if (!speaking_id) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Post ID is required' })

      return
    }

    if (!part) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid part' })
      return
    }

    const currentTimestamp = dayjs.utc().unix()

    SpeakingModel.findByIdAndUpdate(speaking_id, {
      Question: question,
      ExpiredTimeSpeak: expiredTime,
      Part: part,
      TopicName: topicName,
      UpdatedAt: currentTimestamp,
    }).catch(() => {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You update the speaking fail' })
      return
    })

    res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You update the speaking successful' })
  } catch (error) {
    console.log('[update speaking] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}
