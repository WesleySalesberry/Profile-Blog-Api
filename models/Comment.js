const mongoose = require('mongoose')

/*************************************************
     ✔: User
     ✔: Email
     X: Comment
     ✔: Date Added 
*******************************************************/

const CommentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    email:{
        type: String,
        required: true,
        match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    comment: {
        type:String,
        required: [true, 'Body can not be more than 5000 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    blog:{
        type: mongoose.Schema.ObjectId,
        ref: 'Blog',
        required: true
    }
})


module.exports = mongoose.model('Comment', CommentSchema)