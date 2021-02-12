const express = require('express')
const router = express.Router()

const commentsRouter = require('./comment')

const {getBlogs, getBlog, getUnpublishedBlogs, createBlog, blogPhoto, deleteBlog, updateBlog} = require('../controllers/blog')

router.use('/comment/:blogID', commentsRouter)


//TODO: need to figure out how to protect these routes
router
    .route('/')
    .get(getBlogs)
    //Private route
    .post(createBlog)

router
    .route('/unpublished')
    //private route
    .get(getUnpublishedBlogs)
    
router
    .route('/:id')
    .get(getBlog)
    //private route
    .put(updateBlog)
    .delete(deleteBlog)

router
    .route('/image/:id')
    //private route
    .put(blogPhoto)


module.exports = router