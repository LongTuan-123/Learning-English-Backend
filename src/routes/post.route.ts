import express from 'express'
import * as postController from '../controllers/post.controller'

const router = express.Router()

router.post('/api/post/create', postController.create)
router.post('/api/post/delete', postController.deletePost)
router.post('/api/post/update', postController.updatePost)

export default router
