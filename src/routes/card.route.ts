import express from 'express'
import * as cardController from '../controllers/card.controller'

const router = express.Router()

router.get('/api/card', cardController.index)
router.post('/api/card/create', cardController.addCard)
router.post('/api/card/delete', cardController.deleteCard)
router.post('/api/card/:cardId', cardController.detail)

export default router
