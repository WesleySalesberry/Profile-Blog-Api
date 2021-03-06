const express = require('express')
const router = express.Router()

const { login, register, logout, getUser } = require('../controllers/auth')
const { protect } = require('../middlewares/protect')

router
    .route('/login')
    .post(login)

router
    .route('/user')
    .get(protect, getUser)

router
    .route('/register')
    .post(register)

router
    .route('/logout')
    .get(logout)

module.exports = router