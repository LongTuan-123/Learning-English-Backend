import { StatusCodes } from 'http-status-codes'
import { MessageModel } from '../models/Message'

const DEFAULT_START_PAGE = 1
const DEFAULT_ITEM_PER_PAGE = 5

export const sendMsg = async (req, res, next) => {
  try {
    const { from, to, message, type } = req.body

    const response = await MessageModel.create({
      Message: { Text: message, Type: type },
      Users: [from, to],
      Sender: from,
    })

    if (response) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'Message add successfully' })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Message add fail' })
    }
  } catch (error) {
    next(error)
  }
}

export const receivedMsg = async (req, res, next) => {
  try {
    const { from, to, page, limit } = req.body

    const startPage = Number((page || DEFAULT_START_PAGE) - 1)
    const limitPage = Number(limit || DEFAULT_ITEM_PER_PAGE)

    const totalRecords = await MessageModel.countDocuments({
      Users: {
        $all: [from, to],
      },
    })
    const totalPages = Math.ceil(totalRecords / limit)

    const response = await MessageModel.find(
      {
        Users: {
          $all: [from, to],
        },
      },
      null,
      { skip: startPage * limitPage, limit: limitPage },
    )
      .sort({ createdAt: -1 })
      .lean()
      .transform((docs) =>
        docs.map((mess) => ({
          fromSelf: mess.Sender.toString(),
          message: mess.Message.Text,
          type: mess.Message.Type,
        })),
      )

    res.status(StatusCodes.OK).json({
      success: true,
      data: response,
      message: null,
      pagination: { startPage: startPage + 1, limit: Number(limit), totalPages, totalRecords },
    })
  } catch (error) {
    next(error)
  }
}
