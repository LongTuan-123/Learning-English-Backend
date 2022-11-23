import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { TopicDeckModel } from '../models/TopicDeck'
import { UserModel } from '../models/User'

dayjs.extend(utc)

export const index = async (req, res) => {
  try {
    const { userId } = req.query

    if (!userId) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid User Id' })
      return
    }

    UserModel.findById(userId, function (err) {
      if (err) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Dont have this user' })
        return
      }
    })

    const topics = await TopicDeckModel.find(
      {
        UserId: userId,
      },
      null,
      {},
    )
      .lean()
      .transform((docs) =>
        docs.map((doc) => ({
          id: doc._id,
          topicName: doc.TopicName,
          userId: doc.UserId,
          day: doc.CreatedAt,
        })),
      )

    res.status(StatusCodes.OK).json({
      success: true,
      data: topics,
      message: null,
    })
  } catch (error) {
    console.log('[topic deck] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const create = async (req, res) => {
  try {
    const { topicName, userId } = req.body

    if (!topicName) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Topic Name' })
      return
    }

    if (!userId) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid User Id' })
      return
    }

    UserModel.findById(userId, function (err) {
      if (err) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Can find this user' })

        return
      }
    })

    const currentTimestamp = dayjs.utc().unix()

    const createTopicDeck = await TopicDeckModel.create({
      TopicName: topicName,
      UserId: userId,
      CreatedAt: currentTimestamp,
      UpdatedAt: currentTimestamp,
    })

    if (createTopicDeck) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You create topic deck successfully' })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You create topic deck fail' })
    }
  } catch (error) {
    console.log('[create topic deck] Error: ', error)
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

    const response = await TopicDeckModel.findByIdAndDelete(topicId)

    if (response) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You delete topic deck successfully' })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You delete topic deck fail' })
    }
  } catch (error) {
    console.log('[delete topic deck] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}
