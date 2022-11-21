import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { CardModel } from '../models/Card'
import { TopicDeckModel } from '../models/TopicDeck'

dayjs.extend(utc)

const DEFAULT_START_PAGE = 1
const DEFAULT_ITEM_PER_PAGE = 10

export const index = async (req, res) => {
  try {
    const queryString = req.query

    const startPage = Number((queryString.page || DEFAULT_START_PAGE) - 1)
    const limit = Number(queryString.limit || DEFAULT_ITEM_PER_PAGE)
    const keyword = queryString.keyword || ''
    let startDate = queryString.startDate
    let endDate = queryString.endDate

    if (startPage < 0) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid start page option' })
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

    if (!queryString.topicId) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Topic Id' })
      return
    }

    const totalRecords = await CardModel.countDocuments({
      CreatedAt: { $gte: Number(startDate), $lte: Number(endDate) },
    })
    const totalPages = Math.ceil(totalRecords / limit)

    const deckInfo = await CardModel.find(
      {
        CreatedAt: { $gte: Number(startDate), $lte: Number(endDate) },
        TopicId: queryString.topicId,
        Word: { $regex: keyword },
      },
      null,
      { skip: startPage * limit, limit },
    )
      .sort({ CreatedAt: -1 })
      .lean()
      .transform((docs) =>
        docs.map((doc) => ({
          id: doc._id,
          word: doc.Word,
          phonetic: doc.Phonetic,
          audio: doc.Audio,
          meanings: doc.Meanings,
          day: doc.CreatedAt,
        })),
      )

    res.status(StatusCodes.OK).json({
      success: true,
      data: deckInfo,
      pagination: { startPage: startPage + 1, limit: Number(limit), totalPages, totalRecords },
    })
  } catch (error) {
    console.log('[deck] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const addCard = async (req, res) => {
  try {
    const { topicId, word, phonetic, audio, meanings } = req.body

    if (!word) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Word Input' })
      return
    }

    if (!phonetic) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Phonetic Input' })
      return
    }

    if (!meanings) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Meanings Input' })
      return
    }

    TopicDeckModel.findById(topicId, function (err) {
      if (err) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You dont have any topic' })
        return
      }
    })

    const currentTimestamp = dayjs.utc().unix()

    const response = await CardModel.create({
      Word: word,
      Phonetic: phonetic,
      Meanings: meanings,
      Audio: audio,
      TopicId: topicId,
      CreatedAt: currentTimestamp,
      UpdatedAt: currentTimestamp,
    })

    if (response) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You create deck successfully' })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You create deck fail' })
    }
  } catch (error) {
    console.log('[add deck] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.body

    if (!cardId) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid Card Id' })
      return
    }

    const response = await CardModel.findByIdAndDelete(cardId)

    if (response) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You delete card successfully' })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You delete card fail' })
    }
  } catch (error) {
    console.log('[add deck] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const detail = async (req, res) => {
  try {
    const { cardId } = req.params

    CardModel.findById(cardId, function (err, docs) {
      if (err) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Can find this deck' })
      } else {
        res.status(StatusCodes.OK).json({ success: false, data: docs, message: '' })
      }
    })
  } catch (error) {
    console.log('[deck detail] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}
