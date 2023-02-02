import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import { PostModel } from '../models/Post'

dayjs.extend(utc)

const DEFAULT_START_PAGE = 1
const DEFAULT_ITEM_PER_PAGE = 10

export const index = async (req, res) => {
  const queryString = req.query

  const startPage = Number((queryString.page || DEFAULT_START_PAGE) - 1)
  const limit = Number(queryString.limit || DEFAULT_ITEM_PER_PAGE)
  const keyword = queryString.keyword || ''
  let startDate = queryString.startDate
  let endDate = queryString.endDate

  if (startPage < 0) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid start page option' })
    return
  }

  if (Number.isNaN(limit)) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Invalid limit option' })
    return
  }

  if (typeof startDate === 'undefined' || typeof endDate === 'undefined') {
    startDate = startDate ?? dayjs.utc().startOf('month').unix()
    endDate = endDate ?? dayjs.utc().endOf('month').unix()
  }

  try {
    const totalRecords = await PostModel.countDocuments({
      CreatedAt: { $gte: Number(startDate), $lte: Number(endDate) },
    })
    const totalPages = Math.ceil(totalRecords / limit)

    const posts = await PostModel.find(
      {
        CreatedAt: { $gte: Number(startDate), $lte: Number(endDate) },
        Title: { $regex: keyword },
      },
      null,
      { skip: startPage * limit, limit },
    )
      .sort({ CreatedAt: -1 })
      .lean()
      .transform((docs) =>
        docs.map((doc) => ({
          id: doc._id,
          title: doc.Title,
          imageTitle: doc.ImageTitle,
          description: doc.Description,
          day: doc.CreatedAt,
        })),
      )

    if (posts) {
      res.status(StatusCodes.OK).json({
        success: true,
        data: posts,
        pagination: { startPage: startPage + 1, limit: Number(limit), totalPages, totalRecords },
      })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: null })
    }
  } catch (error) {
    console.log('[post] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const create = async (req, res) => {
  try {
    const { title, imageTitle, description } = req.body

    if (!title || title === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Title is required' })

      return
    }

    if (!imageTitle || imageTitle === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Image Title is required' })

      return
    }

    if (!description || description === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Image Title is required' })

      return
    }

    const currentTimestamp = dayjs.utc().unix()

    const response = await PostModel.create({
      Title: title,
      ImageTitle: imageTitle,
      Description: description,
      CreatedAt: currentTimestamp,
      UpdatedAt: currentTimestamp,
    })

    if (response) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You create post successfully' })
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You create post fail' })
    }
  } catch (error) {
    console.log('[create post] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const deletePost = async (req, res) => {
  try {
    const { post_id } = req.body

    if (!post_id) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Post ID is required' })

      return
    }

    const response = await PostModel.findByIdAndDelete(post_id).catch(() => {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You delete the post fail' })
    })

    if (response) {
      res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You delete the post successfully' })
    }
  } catch (error) {
    console.log('[create post] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const detailPost = (req, res) => {
  try {
    const { post_id } = req.query

    PostModel.findById(post_id, function (err, docs) {
      if (err) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Can find this post' })
      } else {
        res.status(StatusCodes.OK).json({ success: false, data: docs, message: '' })
      }
    })
  } catch (error) {
    console.log('[detail post] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}

export const updatePost = async (req, res) => {
  try {
    const { title, imageTitle, description, post_id } = req.body

    if (!title || title === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Title is required' })

      return
    }

    if (!imageTitle || imageTitle === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Image Title is required' })

      return
    }

    if (!description || description === '') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Image Title is required' })

      return
    }

    if (!post_id) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'Post ID is required' })

      return
    }

    const currentTimestamp = dayjs.utc().unix()

    PostModel.findByIdAndUpdate(post_id, {
      Title: title,
      ImageTitle: imageTitle,
      Description: description,
      UpdatedAt: currentTimestamp,
    }).catch(() => {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, data: null, message: 'You update the post fail' })
    })

    res.status(StatusCodes.OK).json({ success: true, data: null, message: 'You update the post successful' })
  } catch (error) {
    console.log('[update post] Error: ', error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, data: null, message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) })
  }
}
