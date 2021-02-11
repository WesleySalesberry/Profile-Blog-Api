const crypto = require('crypto')

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please add a name...']
    },
    email: {
        type: String,
        require: [true, 'Please add an email...'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password...'],
        minlength: 6,
        select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    confirmEmailToken: String,
    isEmailConfirmed: {
        type: Boolean,
        default: false
    },
    role:{
        type: String, 
        enum: ['user', 'demo', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now,
  },

})

//encrpt the password
UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

//cross check the entered password and password in DB
UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

//Signed JWT Token
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

//Generate and hash a reset password token
UserSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex')
    console.log(resetToken)
    this.resetPasswordToken = crypto
                                .createHash('sha256')
                                .update(resetToken)
                                .digest('hex')

    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000

    return resetToken
}

//TODO: Generate email confirm token

module.exports = mongoose.model('User', UserSchema);

