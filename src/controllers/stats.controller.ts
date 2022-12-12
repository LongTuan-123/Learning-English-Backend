import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import { PostStatsModel } from '../models/PostStats'

dayjs.extend(utc)

export const getPostStats = async (req, res) => {
  try {
    const queryString = req.query

    let startDate = queryString.startDate
    let endDate = queryString.endDate

    if (typeof startDate === 'undefined' || typeof endDate === 'undefined') {
      startDate = startDate ?? dayjs.utc().startOf('month').unix()
      endDate = endDate ?? dayjs.utc().endOf('month').unix()
    }

    const postStats = await PostStatsModel.find(
      {
        Day: { $gte: Number(startDate), $lte: Number(endDate) },
      },
      null,
      {},
    )
      .sort({ CreatedAt: -1 })
      .lean()
      .transform((docs) =>
        docs.map((doc) => ({
          id: doc._id,
          day: doc.Day,
          amount: doc.Amount,
        })),
      )

    res.status(StatusCodes.OK).json({
      success: true,
      data: postStats,
    })
  } catch (error) {
    console.log('[post stats] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}
