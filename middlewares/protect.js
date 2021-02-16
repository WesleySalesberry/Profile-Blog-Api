const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse');
const handler = require('./handler')
const jwt = require('jsonwebtoken')


exports.protect = handler( async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    
    }
    // else if(req.cookies.token){
    //     token = req.cookies.token
    // }

    //make sure it is exist
    if(!token){
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }

    try {
        //verify token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id)
        next()
    } catch (error) {
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }
})