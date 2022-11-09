import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { UserModel } from '../models/User'
import { ROLE } from '../types/role'

dayjs.extend(utc)

const ONE_DAY_IN_SECOND = 86400

// User Register
export const register = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(StatusCodes.NOT_FOUND).json('Email & password are required')

      return
    }

    const existEmail = await UserModel.findOne({ Email: email })
    if (existEmail) {
      res.status(StatusCodes.BAD_REQUEST).json('Manager email has already existed')

      return
    }

    const hashedPassword = await bcrypt.hash(password, Number(process.env.AUTH_SALT_VALUE))

    const currentTimestamp = dayjs.utc().unix()
    const userInfo = await UserModel.create({
      Email: email.toLowerCase(),
      HashedPassword: hashedPassword,
      Role: ROLE.MEMBER,
      CreatedAt: currentTimestamp,
      UpdatedAt: currentTimestamp,
    })

    res.status(StatusCodes.OK).json({ success: true, userInfo: { id: userInfo._id, email } })
  } catch (error) {
    console.log('[register] Error: ', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(StatusCodes.NOT_FOUND).json('Email & password are required')

      return
    }

    const userInfo = await UserModel.findOne({ Email: email })
    if (!userInfo) {
      res.status(StatusCodes.NOT_FOUND).json('Invalid login attempt')

      return
    }

    const isValidManagerPassword = bcrypt.compareSync(password, userInfo.HashedPassword)

    if (!isValidManagerPassword) {
      res.status(StatusCodes.BAD_REQUEST).json('Invalid login attempt')

      return
    }

    const jwtToken = jwt.sign(
      { manager_id: userInfo._id, email, role: userInfo.Role },
      process.env.JWT_SECRET_KEY ?? '',
      {
        expiresIn: Number(process.env.JWT_EXPIRATION_DURATION ?? ONE_DAY_IN_SECOND),
      },
    )

    res.status(StatusCodes.OK).json({ success: true, userInfo: { id: userInfo._id, email, token: jwtToken } })
  } catch (error) {
    console.log('[login] Error: ', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
  }
}
