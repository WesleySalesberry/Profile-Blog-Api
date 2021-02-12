const express = require('express')
const router = express.Router({ mergeParams: true })

const { addComment } = require('../controllers/comments')

router
    .route('/')
    .post(addComment)

module.exports = router
