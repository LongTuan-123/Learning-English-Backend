import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import { CardModel } from '../models/Card'
import { RandomCardModel } from '../models/RandomCard'
import { UserModel } from '../models/User'

dayjs.extend(utc)

export const randomCard = async (req, res) => {
  try {
    const { userId } = req.query

    const userRandomModel = await RandomCardModel.findOne({ UserId: userId })

    if (!userRandomModel) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: true, data: null, message: 'You must active your set up in random' })
      return
    }

    if (userRandomModel && !userRandomModel.isActivated) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: true, data: null, message: 'You must active your set up in random' })
      return
    }

    const number = userRandomModel.NumberOfWord || 10
    const level = userRandomModel.Level
    const topicName = userRandomModel.Topic

    if (!topicName) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: true, data: null, message: 'You must set up topic' })
      return
    }
    let arrLevel

    if (level.split(',').length === 0) {
      arrLevel = ['easy', 'normal', 'hard']
    } else {
      arrLevel = level.split(',')
    }

    const currentTimestamp = dayjs.utc().startOf('D').add(1, 'day').unix()

    CardModel.aggregate(
      [
        {
          $match: {
            UserId: userId,
            TopicName: topicName,
            $or: arrLevel.map((lv: string) => ({
              Level: lv,
            })),
          },
        },
        { $sample: { size: number } },
      ],
      function (err, docs) {
        if (err) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ success: true, data: null, message: 'You create post successfully' })
        } else {
          res
            .status(StatusCodes.OK)
            .json({ success: true, data: docs, exp: currentTimestamp, message: 'You create post successfully' })
        }
      },
    )
  } catch (error) {
    console.log('[random Card] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const setup = async (req, res) => {
  try {
    const { number, isActivated, userId, topicName, level } = req.body

    if (number < 0) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, data: null, message: 'Number Of word must more than 0' })
      return
    }

    const currentTimestamp = dayjs.utc().unix()

    const response = await RandomCardModel.create({
      NumberOfWord: number,
      isActivated: isActivated,
      UserId: userId,
      Level: level,
      Topic: topicName,
      CreatedAt: currentTimestamp,
      UpdatedAt: currentTimestamp,
    })

    if (response) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You set up random card successfully' })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You set up random card fail' })
    }
  } catch (error) {
    console.log('[setup] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const updateSetUp = async (req, res) => {
  try {
    const { userId, number, level, topicName } = req.body

    const response = await RandomCardModel.updateOne(
      { UserId: userId },
      { $set: { NumberOfWord: number, Level: level, Topic: topicName } },
      { upsert: true },
    )

    if (response) {
      res
        .status(StatusCodes.OK)
        .json({ success: true, data: null, message: 'You update set up random card successfully' })
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, data: null, message: 'You update set up random card fail' })
    }
  } catch (error) {
    console.log('[setup] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const checkRandomCardUser = async (req, res) => {
  try {
    const { userId } = req.params

    const userSetUp = await RandomCardModel.findOne({ UserId: userId })

    if (!userSetUp) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: null })
    } else {
      res.status(StatusCodes.OK).json({ success: true, data: userSetUp, message: null })
    }
  } catch (error) {
    console.log('[setup] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}
