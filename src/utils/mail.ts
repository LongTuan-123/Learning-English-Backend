require('dotenv').config()

import nodemailer from 'nodemailer'

const MAX = 1000000
const MIN = 100000

export const mailConfig = {
  MAILER: process.env.MAIL_MAILER,
  HOST: process.env.MAIL_HOST,
  PORT: process.env.MAIL_PORT,
  USERNAME: process.env.MAIL_USERNAME,
  PASSWORD: process.env.MAIL_PASSWORD,
  ENCRYPTION: process.env.MAIL_ENCRYPTION,
  FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS,
  FROM_NAME: process.env.MAIL_FROM_NAME,
}

export const sendOtpMail = async (email: string, otpCode: number) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: mailConfig.HOST,
    secure: false,
    auth: {
      user: mailConfig.USERNAME, // generated ethereal user
      pass: mailConfig.PASSWORD, // generated ethereal password
    },
  })

  // send mail with defined transport object
  let options = {
    from: mailConfig.FROM_ADDRESS,
    to: email,
    subject: 'OTP Code to verify your account',
    html: `<div>
      <div>Please check your OTP Code</div>
      <div>OTP Code: <span style="text-decoration: 'underlined';color= 'red'">${otpCode}</span></div>
    </div>`,
  }

  transporter.sendMail(options, (err) => {
    if (err) {
      return false
    }
  })

  return true
}

export const generateCode = () => {
  return Math.round(Math.random() * (MAX - MIN) + MIN)
}
