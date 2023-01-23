import { StatusCodes } from 'http-status-codes'
import { MessageModel } from '../models/Message'
import { MessageGroupModel } from '../models/MessageGroup'

const DEFAULT_START_PAGE = 1
const DEFAULT_ITEM_PER_PAGE = 5

export const sendMsg = async (req, res, next) => {
  try {
    const { from, to, message, type } = req.body

    const response = await MessageModel.create({
      Message: { Text: message, Type: type },
      Users: [from, to],
      Sender: from,
      Status: false,
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
          status: mess.Status,
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

export const seenMsg = async (req, res, next) => {
  try {
    const { status } = req.body
  } catch (error) {
    next(error)
  }
}

export const endMsg = async (req, res, next) => {
  try {
    const { from, to } = req.body

    const response = await MessageModel.find(
      {
        Users: {
          $all: [from, to],
        },
      },
      null,
      {},
    )
      .sort({ createdAt: -1 })
      .limit(1)
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
    })
  } catch (error) {
    next(error)
  }
}

export const addMessageGroup = async (req, res, next) => {
  try {
    const { from, to, user_send, user_received, message, type } = req.body

    const response = await MessageGroupModel.create({
      Message: { Text: message, Type: type },
      From: from,
      To: to,
      Users: [user_send, user_received],
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

export const getMessageGroup = async (req, res, next) => {
  try {
    const { from, to, page, limit } = req.body

    const startPage = Number((page || DEFAULT_START_PAGE) - 1)
    const limitPage = Number(limit || DEFAULT_ITEM_PER_PAGE)

    const totalRecords = await MessageGroupModel.countDocuments({
      Users: {
        $all: [from, to],
      },
    })

    const totalPages = Math.ceil(totalRecords / limit)

    const response = await MessageGroupModel.find(
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
          message: mess.Message.Text,
          type: mess.Message.Type,
          from: {
            email: mess.From,
            user_id: mess.Users[0],
          },
          to: {
            email: mess.To,
            user_id: mess.Users[1],
          },
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

export const updateMessageGroup = async (req, res, next) => {
  try {
    const { message, type, from, to } = req.body

    const response = await MessageGroupModel.findOneAndUpdate(
      {
        $and: [
          {
            User: from,
          },
          {
            User: to,
          },
        ],
      },
      {
        $set: {
          Message: {
            Text: message,
            Type: type,
          },
        },
      },
    )

    if (!response) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Update fail' })

      return
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: response,
      message: 'Update successful',
    })
  } catch (error) {
    next(error)
  }
}
