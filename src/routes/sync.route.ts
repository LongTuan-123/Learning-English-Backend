import express from 'express'
import * as syncController from '../controllers/sync.controller'

const router = express.Router()

router.get('/api/sync/post-stats', syncController.syncPostAmountStats)

export default router
