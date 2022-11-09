import express from 'express'
import * as authenticationController from '../controllers/authentication.controller'

// const authenticationLimiter = RateLimit.middleware({
//   interval: { min: 1 },
//   max: 5000,
//   keyGenerator: async (ctx) => {
//     const vercelIp = ctx.request.header['x-vercel-proxied-for']
//     let ip = vercelIp ?? ctx.request.header['cf-connecting-ip']
//     if (!ip) {
//       ip = ctx.request.ip
//     }
//     return `${ip}`
//   },
// })

const router = express.Router()

router.post('/api/v1/register', authenticationController.register)
// router.post('/api/v1/login', authenticationLimiter, authenticationController.login)

export default router
