const express = require('express')
const app = express()

const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const path = require('path')

const connectDB = require('./config/db')

//app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(express.json())
app.use(fileUpload())

const blog = require('./routes/blog')
const comment = require('./routes/comment')
const auth = require('./routes/auth')

app.use('/api/v1/blog', blog)
app.use('/api/v1/comment', comment)
app.use('/api/v1/auth', auth)

//@test Logging routes to compare to API Call
dotenv.config({ path: './config/config.env'})
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

connectDB()
const PORT = process.env.PORT || 5000


//If the route is not a valid route 
app.get('*', (req, res) => {
	res.status(404).json({
        success: false,
        message: "Invalid Route"
    })
});
const server = app.listen(PORT, console.log(`> Server running in ${process.env.NODE_ENV}: http://localhost:${PORT}`.brightBlue.bold))
//Handle Rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red)
    server.close(() => process.exit(1))
})