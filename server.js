const express = require('express')
const app = express()

const swaggerUI = require("swagger-ui-express");
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml');

const dotenv = require('dotenv').config();
const morgan = require('morgan');
const colors = require('colors');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require("helmet");
const xss = require('xss-clean')
const hpp = require('hpp');
const rateLimit = require("express-rate-limit");

const errorHandler = require('./middlewares/errorHandler');

const connectDB = require('./utils/db');

const PORT = process.env.PORT || 5000

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
})

// app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())
app.use(mongoSanitize())
app.use(helmet());
app.use(xss())
app.use(hpp());
app.use(limiter)

const blog = require('./routes/blog')
const comment = require('./routes/comment')
const projects = require('./routes/project')
const auth = require('./routes/auth')
const mail = require('./routes/sendEmail')

const options ={
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Wesley's API",
}

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument, options));
app.use('/api/v1/blog', blog)
app.use('/api/v1/comment', comment)
app.use('/api/v1/auth', auth)
app.use('/api/v1/project', projects)
app.use('/api/v1/mail', mail)

app.use(errorHandler)


//If the route is not a valid route 
app.get('*', (req, res) => {
	res.status(404).json({
        success: false,
        message: "Invalid Route"
    })
});

//dotenv.config()

//@test Logging routes to compare to API Call
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

connectDB()

const server = app.listen(PORT, console.log(`> Server running in ${process.env.NODE_ENV}: http://localhost:${PORT}/api-docs/`.brightBlue.bold))
//Handle Rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red)
    server.close(() => process.exit(1))
})