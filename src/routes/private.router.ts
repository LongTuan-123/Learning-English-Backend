import express from 'express'
import * as authController from '../controllers/authentication.controller'
import * as randomController from '../controllers/randomCard.controller'
import * as postStatsController from '../controllers/stats.controller'
import * as messageController from '../controllers/message.controller'
import * as resultTestController from '../controllers/resultExam.controller'
import * as speakingController from '../controllers/speaking.controller'

const router = express.Router()

// Api log out
router.post('/api/auth/logout', authController.logout)

// Api random card
router.get('/api/random', randomController.randomCard)
router.post('/api/setup', randomController.setup)
router.get('/api/check-random/:userId', randomController.checkRandomCardUser)
router.post('/api/update-setup', randomController.updateSetUp)

// Api get stats
router.get('/api/post-stats', postStatsController.getPostStats)

// Api message
router.post('/api/message/send-msg', messageController.sendMsg)
router.post('/api/message/received-msg', messageController.receivedMsg)

// Api result exam
router.get('/api/result-test', resultTestController.getResultTest)
router.post('/api/result-test/add', resultTestController.addResultTest)

// Api Speaking
router.get('/api/speaking', speakingController.getSpeaking)
router.post('/api/speaking/add', speakingController.addSpeakingFile)
router.post('/api/speaking/delete', speakingController.deleteSpeaking)
router.post('/api/speaking/update', speakingController.updatePost)

export default router
