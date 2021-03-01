const Comment = require('../models/Comment')
const Blog = require('../models/Blog')
const handler = require('../middlewares/handler')
const ErrorResponse = require('../utils/errorResponse')

exports.addComment = handler( async (req, res, next) => {
    const blogID = req.params.blogID

    const blog = Blog.findById(blogID)

    if(!blog){ 
        return next(
            new ErrorResponse(`No Blog with id ${blogID}`, 404)
        )
    }
    
    req.body.blog = req.params.blogID

    const comment = await Comment.create(req.body)

    res.status(200).json({
        success: true,
        data: comment
    })
})
