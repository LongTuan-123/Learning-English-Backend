import express from 'express'
import * as randomController from '../controllers/randomCard.controller'
import * as postStatsController from '../controllers/stats.controller'
import * as messageController from '../controllers/message.controller'

const router = express.Router()

// Api random card
router.get('/api/random', randomController.randomCard)

// Api get stats
router.get('/api/post-stats', postStatsController.getPostStats)

// Api message
router.post('/api/message/send-msg', messageController.sendMsg)
router.post('/api/message/received-msg', messageController.receivedMsg)

export default router
