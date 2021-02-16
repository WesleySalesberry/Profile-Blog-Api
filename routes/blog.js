const express = require('express')
const router = express.Router()

const commentsRouter = require('./comment')
const { protect } = require('../middlewares/protect')

const {getBlogs, getBlog, getUnpublishedBlogs, createBlog, blogPhoto, deleteBlog, updateBlog} = require('../controllers/blog')

router.use('/comment/:blogID', commentsRouter)

router
    .route('/')
    .get(getBlogs)
    .post(protect, createBlog)

router
    .route('/unpublished')
    //private route
    .get(protect, getUnpublishedBlogs)
    
router
    .route('/:id')
    .get(getBlog)
    //private route
    .put(protect, updateBlog)
    .delete(protect, deleteBlog)

router
    .route('/image/:id')
    //private route
    .put(protect, blogPhoto)


module.exports = router