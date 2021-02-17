const Blog = require('../models/Blog')
const handler = require('../middlewares/handler')
const path = require('path')
const cloudinary = require('../utils/cloudinary')
const ErrorResponse = require('../utils/errorResponse')

//@desc Get published blogs
//@route GET /api/v1/blogs
//@access Public
exports.getBlogs = handler (async (req, res, next) => {
    let blog = await Blog.find().sort('-createdAt')
    blog = blog.filter(item => item.isPublished === true)

    res.status(200).json({
        success: true,
        count: blog.length,
        data: blog
    })
})

//@desc Get un-published blogs
//@route GET /api/v1/blogs/unpublished
//@access Private
exports.getUnpublishedBlogs = handler (async (req, res, next) => {
    let blog = await Blog.find().sort('isPublished')
    blog = blog.filter(item => item.isPublished === false)

    res.status(200).json({
        success: true,
        count: blog.length,
        data: blog
    })
})



//@desc Get single published blog
//@route GET /api/v1/blog/:id
//@access Public
exports.getBlog = handler( async (req, res, next) => {
    const blogID = req.params.id

    const blog = await Blog.findById(blogID).populate({path: 'comments', options:{ sort: {'createdAt': -1}}})

    if(!blog){
        return next(
            new ErrorResponse(`Blog not found with id ${blogID}`, 404)
        )
    }

    res.status(200).json({
        success: true,
        data: blog
    })
})


//@desc  Create a blog
//@route GET /api/v1/blog
//@access Private
exports.createBlog = handler( async (req, res, next) => {
    req.body.user = req.user.id
    const blog = await Blog.create(req.body)
    res.status(200).json({
        success: true,
        data: blog
    })
})


//@desc  Add a photo blog
//@route GET /api/v1/blog/image/:id
//@access Private
exports.blogPhoto = handler( async (req, res, next) => {
    const image = req.files.file
    const blogID = req.params.id
    
    let blogPost = await Blog.findById(blogID)

    if(!blogPost){
        console.log(`Blog Post with ID ${blogID} not found...`)
        return next()
    }

    if(!image.mimetype.startsWith('image')){
        console.log("Not an image")
        return next()
    }

    if(image.size > process.env.MAX_FILEUPLOAD){
        console.log('Image is to large')
        return next()
    }

    image.name = `image_${blogID}${path.parse(image.name).ext}`

    image.mv(`${process.env.FILE_UPLOAD_PATH}/${image.name}`, async err => {
        if(err) {
            console.log(`${err}`)
            return next()
        }
        const cloudIMG = await cloudinary.uploader.upload(`${process.env.FILE_UPLOAD_PATH}/${image.name}`)
        blogPost = await Blog.findByIdAndUpdate(blogID, {
            image: cloudIMG.secure_url,
            cloudinary_id: cloudIMG.public_id 
        })
    })
   

    res.status(200).json({
        success: true,
        data: blogPost
    })
})


//@desc  Delete a blog
//@route GET /api/v1/blog/delete/:id
//@access Private
exports.deleteBlog = handler( async (req, res, next) => {
 
        const blogID = req.params.id
        const blog = await Blog.findById(blogID)

        if(!blog){
            return next(
                new ErrorResponse(`Blog not found with id of ${blogID}`, 404))
        }

        blog.remove()

        res.status(200).json({
            success: true,
            data: `Blog with id ${blogID} is deleted`
    })
    
})


//@desc  Update a blog
//@route PUT /api/v1/blog/:id
//@access Private
exports.updateBlog = handler( async (req, res, next) => {
        const blogID = req.params.id
        let blog = await Blog.findById(blogID)

        if(!blog){
            return next(new ErrorResponse(`Blog not found with id of ${blogID}`, 404))
        }

        blog = await Blog.findByIdAndUpdate(blogID, req.body, {
        new: true,
        runValidators: true
    })
        res.status(200).json({
            success: true,
            data: blog
    })
})




