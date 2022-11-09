import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { UserModel } from '../models/User'
import { getReasonPhrase } from 'http-status-codes/build/cjs/utils-functions'
import { Types } from 'mongoose'

dayjs.extend(utc)

// User Register
export const register = async (ctx: {
  request: { body: { email: string; password: string } }
  status: StatusCodes
  body: { success: boolean; message?: string; manager?: { id: Types.ObjectId; email: string } }
}) => {
  try {
    const { email, password } = ctx.request.body
    if (!email || !password) {
      ctx.status = StatusCodes.NOT_FOUND
      ctx.body = {
        success: false,
        message: 'Email & password are required',
      }
      return
    }

    const existEmail = await UserModel.findOne({ Email: email })
    if (existEmail) {
      ctx.status = StatusCodes.BAD_REQUEST
      ctx.body = { success: false, message: 'Manager email has already existed' }
    }

    const salt = await bcrypt.genSalt(Number(process.env.AUTH_SALT_VALUE))
    const hashedPassword = bcrypt.hashSync(password, salt)

    const currentTimestamp = dayjs.utc().unix()
    const manager = await UserModel.create({
      Email: email.toLowerCase(),
      HashedPassword: hashedPassword,
      CreatedAt: currentTimestamp,
      UpdatedAt: currentTimestamp,
    })

    ctx.status = StatusCodes.OK
    ctx.body = { success: true, manager: { id: manager._id, email } }
  } catch (error) {
    console.log('[register] Error: ', error)
    ctx.status = StatusCodes.INTERNAL_SERVER_ERROR
    ctx.body = { success: false, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) }
  }
}
