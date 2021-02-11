const mongoose = require('mongoose')

/*************************************************
     ✔: Needs a title
     ✔: Needs an image and if no image then set a default one https://source.unsplash.com/1600x900/?computer
     ✔: Needs a Body 
     ✔: Needs searchable Tags
     ✔: Needs a date published
     ✔: Needs a boolean to see if it is published 
*******************************************************/

const BlogSchema = new mongoose.Schema({
    title:{
        type: String,
        unique:true,
        trim: true,
        require: [true, 'Please add title'],
        maxlength: [50, 'Title cannot be more than 50 characters']
    },
    body: {
        type: String,
        required: true,
         maxlength: [20000, 'Body can not be more than 20000 characters']
    },
    image: {
        type: String
    }, 
    cloudinary_id: {
        type: String
    },
    tags:{
        type:[String],
        required: false, 
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }

}, {
    toJSON:{ virtuals: true }
},{
    toObject:{ virtuals: true }
})
//Sets a default image
BlogSchema.pre('save', async function(next){
    this.image = 'https://source.unsplash.com/1600x900/?programming,developer'
})

BlogSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'blog', 
    justOne: false
})

module.exports = mongoose.model('Blog', BlogSchema)