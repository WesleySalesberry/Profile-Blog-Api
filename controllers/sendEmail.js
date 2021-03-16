const handler = require('../middlewares/handler')
const sendEmail = require('../utils/mail')
const ErrorResponse = require('../utils/errorResponse')

exports.sendEmail = handler( async (req, res, next) => {
    const { name, email, message} = req.body

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isVaild = emailRegex.test(email)

    if(!isVaild){
        console.log(isVaild)
        return next(
            new ErrorResponse(`${email} is not a valid email`, 400 )
        )
    }
    
    try {
        await sendEmail({
            email: email,
            subject: `Message from ${name}`,
            message, name
        })  
        res.status(200).json({
            success: true,
            data: "Email was sent"
        })
    } catch (error) {
        console.log(` Controller-Error: ${error}`)
    }
     
})