import express from 'express'
import * as postStatsController from '../controllers/stats.controller'

const router = express.Router()

router.get('/api/post-stats', postStatsController.getPostStats)

export default router
