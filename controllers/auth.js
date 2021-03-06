const User = require('../models/User')
const crypto = require('crypto')

const handler = require('../middlewares/handler')
const tokenResponse = require('../middlewares/token')
const ErrorResponse = require('../utils/errorResponse')

//Place holder for possable use later
// @desc   Register User
// @route  POST /api/v1/auth/register
// @access Public
exports.register = handler(async (req, res, next) => {
    // const { name, email, password, role } = req.body
    // const user = await User.create({
    //     name, 
    //     email,
    //     password,
    //     role
    // })

    console.log(user)
    res.status(303).send({
        success: false,
    })
})

// @desc   Login User
// @route  POST /api/v1/auth/login
// @access Public
exports.login = handler( async (req, res, next) => {
    const { email, password } = req.body

    if(!email || !password){
        return next(
            new ErrorResponse('Please provide an email and password', 400)
        )
    }

    const user = await User.findOne({ email }).select('+password')

    if(!user){
        return next(
             new ErrorResponse('Invalid credentials', 400)
        )
    }

    const isMatched = await user.matchPassword(password)

    if(!isMatched){
        return next(
             new ErrorResponse('Invalid credentials', 400)
        )
        
    }

    tokenResponse(user, 200, res)
})

// @desc  Get current Login User
// @route  GET /api/v1/auth/login
// @access Private
exports.getUser = handler(async (req, res, next) =>{
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    })
})

// @desc   Log User Out
// @route  GET /api/v1/auth/logout
// @access Private
exports.logout = handler(async (req, res, next) => {
    res.cookie('token', 'none',{
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        data: {}
    })
})

// @desc   Update password
// @route  GET /api/v1/auth/updatepassword
// @access Private
exports.updatePasword = handler( async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')
    const isMatched = await user.matchPassword(req.body.currentPassword)
    if(!isMatched){
        return next(
             new ErrorResponse('Password is incorrect', 401)
        )
    }

    user.password = req.body.newPassword;
    await user.save()

    res.status(200).json({
        success: true,
        data: user
    })
})

//TODO: forgot password route
//TODO: reset password