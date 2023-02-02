import { StatusCodes } from 'http-status-codes'
import { MessageModel } from '../models/Message'
import { MessageGroupModel } from '../models/MessageGroup'
import { UserModel } from '../models/User'

const DEFAULT_START_PAGE = 1
const DEFAULT_ITEM_PER_PAGE = 5

export const sendMsg = async (req, res, next) => {
  try {
    const { from, to, message, status, type } = req.body

    const response = await MessageModel.create({
      Message: { Text: message, Type: type },
      Users: [from, to],
      Sender: from,
      Status: status,
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

export const updateSeenMsg = async (req, res, next) => {
  try {
    const { from, to } = req.body

    const response = await UserModel.updateMany(
      {
        Users: {
          $all: [from, to],
        },
        Status: false,
      },
      {
        $set: {
          Status: true,
        },
      },
    )

    if (response) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'Seen successfully' })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'UnSeen fail' })
    }
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
      UnSeen: 1,
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
    const { userId, page, limit } = req.body

    const startPage = Number((page || DEFAULT_START_PAGE) - 1)
    const limitPage = Number(limit || DEFAULT_ITEM_PER_PAGE)

    const totalRecords = await MessageGroupModel.countDocuments({
      Users: userId,
    })

    const totalPages = Math.ceil(totalRecords / limit)

    const response = await MessageGroupModel.find(
      {
        Users: userId,
      },
      null,
      { skip: startPage * limitPage, limit: limitPage },
    )
      .sort({ createdAt: -1 })
      .lean()
      .transform((docs) =>
        docs.map((mess) => ({
          id: mess._id,
          message: mess.Message.Text,
          type: mess.Message.Type,
          unSeen: mess.UnSeen,
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
    const { message, type, id } = req.body

    const response = await MessageGroupModel.findByIdAndUpdate(id, {
      $set: {
        Message: {
          Text: message,
          Type: type,
        },
      },
    })

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

export const updateUnSeenMessageGroup = async (req, res, next) => {
  try {
    const { unSeen, from, to } = req.body

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
          UnSeen: unSeen,
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
