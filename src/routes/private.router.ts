import express from 'express'
import * as randomController from '../controllers/randomCard.controller'
import * as postStatsController from '../controllers/stats.controller'

const router = express.Router()

// Api random card
router.get('/api/random', randomController.randomCard)

// Api get stats
router.get('/api/post-stats', postStatsController.getPostStats)

export default router
