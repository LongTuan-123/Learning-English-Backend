import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import { PostModel } from '../models/Post'
import { PostStatsModel } from '../models/PostStats'
import { ResultTestModel } from '../models/ResultTest'
import { ResultTestStatsModel } from '../models/ResultTestStats'

dayjs.extend(utc)

export const syncPostAmountStats = async (req, res) => {
  const queryString = req.query

  let startTime: null | number = null
  let endTime: null | number = null

  if (typeof queryString.startTime !== 'undefined') {
    startTime = dayjs
      .utc(Number(queryString.startTime) * 1000)
      .startOf('day')
      .unix()
    endTime = dayjs
      .utc(Number(queryString.startTime) * 1000)
      .endOf('day')
      .unix()
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid time query' })
    return
  }

  try {
    const amountResponse = await PostStatsModel.findOne({ Day: endTime }).lean()

    if (amountResponse && Object.keys(amountResponse).length > 0) {
      res
        .status(StatusCodes.OK)
        .json({ success: true, result: { total_minted: amountResponse.Amount, end_of_day: amountResponse.Day } })

      return
    }

    const totalPostAmount = await PostModel.countDocuments({
      CreatedAt: { $gte: startTime, $lte: endTime },
    })

    const amountRecord = {
      Day: endTime,
      Amount: totalPostAmount,
      CreatedAt: dayjs.utc().unix(),
      UpdatedAt: dayjs.utc().unix(),
    }

    await PostStatsModel.findOneAndUpdate({ Day: endTime }, amountRecord, { upsert: true })

    res.status(StatusCodes.OK).json({ success: true, result: { total_minted: totalPostAmount, end_of_day: endTime } })
  } catch (error) {
    console.log('[post] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const syncResultTestAmountStats = async (req, res) => {
  const queryString = req.query

  let startTime: null | number = null
  let endTime: null | number = null

  if (typeof queryString.startTime !== 'undefined') {
    startTime = dayjs
      .utc(Number(queryString.startTime) * 1000)
      .startOf('day')
      .unix()
    endTime = dayjs
      .utc(Number(queryString.startTime) * 1000)
      .endOf('day')
      .unix()
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid time query' })
    return
  }

  try {
    const amountResponse = await ResultTestStatsModel.findOne({ Day: endTime }).lean()

    if (amountResponse && Object.keys(amountResponse).length > 0) {
      res
        .status(StatusCodes.OK)
        .json({ success: true, result: { total_minted: amountResponse.Amount, end_of_day: amountResponse.Day } })

      return
    }

    const totalPostAmount = await ResultTestModel.countDocuments({
      CreatedAt: { $gte: startTime, $lte: endTime },
    })

    const amountRecord = {
      Day: endTime,
      Amount: totalPostAmount,
      CreatedAt: dayjs.utc().unix(),
      UpdatedAt: dayjs.utc().unix(),
    }

    await ResultTestStatsModel.findOneAndUpdate({ Day: endTime }, amountRecord, { upsert: true })

    res.status(StatusCodes.OK).json({ success: true, result: { total_minted: totalPostAmount, end_of_day: endTime } })
  } catch (error) {
    console.log('[post] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}
