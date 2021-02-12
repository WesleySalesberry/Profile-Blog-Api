const User = require('../models/User')
const handler = require('../middlewares/handler')
const crypto = require('crypto')

const tokenResponse = require('../middlewares/token')

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
        console.log("Please provide an email and password, 400")
        return next()
    }

    const user = await User.findOne({ email }).select('+password')

    if(!user){
        console.log('Invalid credentials', 401)
        return next()
    }

    const isMatched = await user.matchPassword(password)

    if(!isMatched){
        console.log('Invalid credentials, 401')
        return next()
    }

    tokenResponse(user, 200, res)
})

// @desc   Log User Out
// @route  GET /api/v1/auth/logout
// @access Private
exports.logout = handler(async (req, res, next) => {
    res.cookies('token', 'none',{
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
        console.log('Password is incorrect 401')
        return next()
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