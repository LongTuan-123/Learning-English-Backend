import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { ResultTestModel } from '../models/ResultTest'

dayjs.extend(utc)

const DEFAULT_START_PAGE = 1
const DEFAULT_ITEM_PER_PAGE = 10

export const getResultTest = async (req, res) => {
  const queryString = req.query

  const startPage = Number((queryString.page || DEFAULT_START_PAGE) - 1)
  const limit = Number(queryString.limit || DEFAULT_ITEM_PER_PAGE)
  const keyword = queryString.keyword || ''
  const userId = queryString.userId
  let startDate = queryString.startDate
  let endDate = queryString.endDate

  if (startPage < 0) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid start page option' })
    return
  }

  if (!userId) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid user Id' })
    return
  }

  if (Number.isNaN(limit)) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid limit option' })
    return
  }

  if (typeof startDate === 'undefined' || typeof endDate === 'undefined') {
    startDate = startDate ?? dayjs.utc().startOf('month').unix()
    endDate = endDate ?? dayjs.utc().endOf('month').unix()
  }

  try {
    const totalRecords = await ResultTestModel.countDocuments({
      CreatedAt: { $gte: Number(startDate), $lte: Number(endDate) },
      User: userId,
    })
    const totalPages = Math.ceil(totalRecords / limit)

    const resultSkill = await ResultTestModel.find(
      {
        CreatedAt: { $gte: Number(startDate), $lte: Number(endDate) },
        Topic: { $regex: keyword },
        User: userId,
      },
      null,
      { skip: startPage * limit, limit },
    )
      .sort({ CreatedAt: -1 })
      .lean()
      .transform((docs) =>
        docs.map((doc) => ({
          id: doc._id,
          result: doc.ResultTest,
          topic: doc.Topic,
          day: doc.CreatedAt,
        })),
      )

    res.status(StatusCodes.OK).json({
      success: true,
      data: resultSkill,
      pagination: { startPage: startPage + 1, limit: Number(limit), totalPages, totalRecords },
    })
  } catch (error) {
    console.log('[post stats] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const addResultTest = async (req, res) => {
  try {
    const { resultTest, topicName, userId } = req.body

    if (!resultTest) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid result exam' })
      return
    }

    if (!userId) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid user Id' })
      return
    }

    if (!topicName) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Topic' })
      return
    }

    const currentTimestamp = dayjs.utc().unix()

    const response = await ResultTestModel.create({
      ResultTest: resultTest,
      User: userId,
      Topic: topicName,
      CreatedAt: currentTimestamp,
      UpdatedAt: currentTimestamp,
    })

    if (response) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You create result exam successfully' })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You create result exam fail' })
    }
  } catch (error) {
    console.log('[post stats] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}
