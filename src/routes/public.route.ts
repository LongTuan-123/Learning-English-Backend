import express from 'express'
import * as postController from '../controllers/post.controller'

const router = express.Router()

router.get('/api/post', postController.index)
router.get('/api/post/detail', postController.detailPost)

export default router
