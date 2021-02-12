const Comment = require('../models/Comment')
const Blog = require('../models/Blog')
const handler = require('../middlewares/handler')


//@desc  Create a commit
//@route GET /api/v1/blog/comment/:blogID
//@access Public
exports.addComment = handler( async (req, res, next) => {
    const blogID = req.params.blogID

    const blog = Blog.findById(blogID)

    if(!blog){ 
        console.log('No match')
        return next()
    }
    //console.log(req.blog.blogID)
    req.body.blog = req.params.blogID
    //console.log(req.body)
    const comment = await Comment.create(req.body)

    res.status(200).json({
        success: true,
        data: comment
    })
})
