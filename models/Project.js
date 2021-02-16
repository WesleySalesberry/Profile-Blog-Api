const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    description: {
        type: String,
        required: true,
        maxlength: [500, 'Body can not be more than 20000 characters']
    },
    languages:{
        type:[String],
        required: true, 
    },
    website: {
        type: String,
        required: false,
        match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS'
      ],
    },
    github: {
        type: String,
        required: false,
        match: [
        /https?:\/\/(www\.)?github\.[a-zA-Z0-9()]{1,6}\b/,
        'Please use a valid URL with HTTP or HTTPS'
      ]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Project', ProjectSchema)