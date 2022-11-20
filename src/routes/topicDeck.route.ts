import express from 'express'
import * as topicDeckController from '../controllers/topicDeck.controller'

const router = express.Router()

router.get('/api/topic-deck', topicDeckController.index)
router.post('/api/topic-deck/create', topicDeckController.create)
router.post('/api/topic-deck/delete', topicDeckController.deleteTopicDeck)

export default router
