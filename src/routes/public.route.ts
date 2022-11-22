import express from 'express'
import * as postController from '../controllers/post.controller'
import * as randomController from '../controllers/randomCard.controller'

const router = express.Router()

router.get('/api/post', postController.index)
router.get('/api/post/detail', postController.detailPost)
router.get('/api/random', randomController.randomCard)

export default router
