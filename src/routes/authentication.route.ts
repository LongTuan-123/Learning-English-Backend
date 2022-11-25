import express from 'express'
import * as authenticationController from '../controllers/authentication.controller'

const router = express.Router()

router.post('/api/auth/register', authenticationController.register)
router.post('/api/auth/login', authenticationController.login)
router.post('/api/auth/verify', authenticationController.verify)
router.post('/api/auth/resend', authenticationController.resend)
router.get('/api/auth/get-list', authenticationController.getListUser)

export default router
