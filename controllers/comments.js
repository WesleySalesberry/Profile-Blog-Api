const Comment = require('../models/Comment')
const Blog = require('../models/Blog')
const handler = require('../middlewares/handler')
const ErrorResponse = require('../utils/errorResponse')


//@desc  Create a commit
//@route GET /api/v1/blog/comment/:blogID
//@access Public
/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - email
 *         - comment
 *       properties:
 *         id:
 *           type: string
 *           description: auto-generated id
 *         name:
 *           type: string
 *           description: The commenters name
 *         email: 
 *          type: string
 *          description: The email of the commenter
 *         comment:
 *          type: string
 *          description: The body of the comment
 *       example:
 *          name: Wes
 *          email: demo@email.com
 *          comment: Some text here 
 */


/**
* @swagger
* tags:
*   name: Comment
*   description: The comment managing API
*/
/**
 * @swagger
 * /blog/comment/{id}:
 *  put:
 *    summary: Update the blog by the id
 *    tags: [Comment]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The blog id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Comment'
 *    responses:
 *      200:
 *        description: The comment was added
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Comment'
 *      404:
 *        description: The blog was not found
 */
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
