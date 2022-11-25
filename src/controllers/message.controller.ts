import { StatusCodes } from 'http-status-codes'
import { MessageModel } from '../models/Message'

export const sendMsg = async (req, res, next) => {
  try {
    const { from, to, message } = req.body

    const response = await MessageModel.create({
      Message: { Text: message },
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
    const { from, to } = req.body
    const response = await MessageModel.find({
      Users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 })

    const messages = response.map((mess) => {
      return {
        fromSelf: mess.Sender.toString() === from,
        message: mess.Message.Text,
      }
    })

    if (messages) {
      res.status(StatusCodes.OK).json({ success: true, data: messages, message: null })
    } else {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'Dont have any data' })
    }
  } catch (error) {
    next(error)
  }
}
