import express from 'express'
import * as authenticationController from '../controllers/authentication.controller'

const router = express.Router()

router.post('/api/v1/register', authenticationController.register)
router.post('/api/v1/login', authenticationController.login)

export default router
