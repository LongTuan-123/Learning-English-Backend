import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { UserModel } from '../models/User'
import { ROLE } from '../types/role'
import { generateCode, sendOtpMail } from '../utils/mail'

dayjs.extend(utc)

const ONE_DAY_IN_SECOND = 86400
const DEFAULT_START_PAGE = 1
const DEFAULT_ITEM_PER_PAGE = 5

// User Register
export const register = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(StatusCodes.NOT_FOUND).json({ success: false, data: null, message: 'Email & password are required' })

      return
    }

    const existEmail = await UserModel.findOne({ Email: email })
    if (existEmail) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, data: null, message: 'Manager email has already existed' })

      return
    }

    const otpCode = generateCode()

    if (!sendOtpMail(email, otpCode)) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You send email failed' })

      return
    }

    const hashedPassword = await bcrypt.hash(password, Number(process.env.AUTH_SALT_VALUE))

    const currentTimestamp = dayjs.utc().unix()
    const userInfo = await UserModel.create({
      Email: email.toLowerCase(),
      HashedPassword: hashedPassword,
      Role: ROLE.MEMBER,
      IsActivated: false,
      OtpCode: otpCode,
      CreatedAt: currentTimestamp,
      UpdatedAt: currentTimestamp,
    })

    res.status(StatusCodes.OK).json({
      success: true,
      data: { id: userInfo._id, email, role: userInfo.Role },
      message: 'Please check your email to get OTP',
    })
  } catch (error) {
    console.log('[register] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    console.log(req.body)
    if (!email || !password) {
      res.status(StatusCodes.NOT_FOUND).json({ success: false, data: null, message: 'Email & password are required' })

      return
    }

    const userInfo = await UserModel.findOne({ Email: email })
    if (!userInfo) {
      res.status(StatusCodes.NOT_FOUND).json({ success: false, data: null, message: 'Invalid login attempt' })

      return
    }

    if (!userInfo.IsActivated) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Your account is not activated' })

      return
    }

    const isValidManagerPassword = bcrypt.compareSync(password, userInfo.HashedPassword)

    if (!isValidManagerPassword) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid login attempt' })

      return
    }

    const jwtToken = jwt.sign(
      { manager_id: userInfo._id, email, role: userInfo.Role },
      process.env.JWT_SECRET_KEY ?? '',
      {
        expiresIn: Number(process.env.JWT_EXPIRATION_DURATION ?? ONE_DAY_IN_SECOND),
      },
    )

    res.status(StatusCodes.OK).json({ success: true, data: { id: userInfo._id, email, token: jwtToken } })
  } catch (error) {
    console.log('[login] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

// User verify
export const verify = async (req, res) => {
  try {
    const { email, otpCode } = req.body

    const checkOtp = await UserModel.findOne({ Email: email, OtpCode: otpCode })

    if (!checkOtp) {
      res.status(StatusCodes.NOT_FOUND).json({ success: false, data: null, message: 'Verify code fail' })

      return
    }
    const updateUser = await UserModel.findOneAndUpdate({ Email: email }, { IsActivated: true })

    if (!updateUser) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Verify code fail' })

      return
    }

    res.status(StatusCodes.OK).json({ success: true, data: null, message: 'Register successfully' })
  } catch (error) {
    console.log('[verify] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

// User resend code
export const resend = async (req, res) => {
  try {
    const { email } = req.body

    const otpCode = generateCode()

    if (!sendOtpMail(email, otpCode)) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You send email failed' })

      return
    }

    const updateUser = await UserModel.findOneAndUpdate({ Email: email }, { OtpCode: otpCode })

    if (!updateUser) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Resend fail' })

      return
    }

    res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You have to resend otp code.' })
  } catch (error) {
    console.log('[resend] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const logout = (_req, res) => {
  try {
    jwt.sign({ logout: true }, process.env.JWT_SECRET_KEY ?? '', {
      expiresIn: 0,
    })

    res.status(StatusCodes.OK).json({ success: true, data: null, message: 'Logout successfully' })
  } catch (error) {
    console.log('[log out] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const getListUser = async (req, res) => {
  const queryString = req.query

  const startPage = Number((queryString.page || DEFAULT_START_PAGE) - 1)
  const limit = Number(queryString.limit || DEFAULT_ITEM_PER_PAGE)
  const keyword = queryString.keyword || ''

  if (keyword === '') {
    res.status(StatusCodes.OK).json({
      success: true,
      data: [],
    })

    return
  }

  try {
    const totalRecords = await UserModel.countDocuments({
      Email: { $regex: keyword },
    })
    const totalPages = Math.ceil(totalRecords / limit)

    const response = await UserModel.find(
      {
        Email: { $regex: keyword },
      },
      null,
      { skip: startPage * limit, limit },
    )
      .sort({ CreatedAt: -1 })
      .lean()
      .transform((docs) =>
        docs.map((doc) => ({
          id: doc._id,
          email: doc.Email,
        })),
      )

    if (response) {
      res.status(StatusCodes.OK).json({
        success: true,
        data: response,
        pagination: { startPage: startPage + 1, limit: Number(limit), totalPages, totalRecords },
      })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: null })
    }
  } catch (error) {
    console.log('[get list user] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}
