import express from 'express'
import * as cardController from '../controllers/card.controller'

const router = express.Router()

router.get('/api/card', cardController.index)
router.post('/api/card/create', cardController.addCard)
router.post('/api/card/delete', cardController.deleteCard)
router.get('/api/card/:cardId', cardController.detail)
router.post('/api/card/check', cardController.checkCard)

export default router
