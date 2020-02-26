const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const morgan = require('morgan')
const colors = require('colors')
const bodyParser = require('body-parser')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')
const fileupload = require('express-fileupload')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp =require('hpp')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')




const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')
const helmet = require('helmet')
const cors = require('cors')
 dotenv.config({path:'./config/config.env'})


connectDB()

const app = express()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(fileupload())

app.use(mongoSanitize())
app.use(helmet())
app.use(xss())
const limiter = rateLimit({
    windowMs:10*60*1000,
    max:1
})
app.use(limiter)
app.use(hpp())
app.use(cors())
app.use(express.static(path.join(__dirname,'public ')))



app.use('/api/v1/bootcamps',bootcamps)
app.use('/api/v1/courses',courses)
app.use('/api/v1/courses',auth)
app.use('/api/v1/courses',users)
app.use('/api/v1/reviews',reviews)

app.use(errorHandler)

const PORT = process.env.PORT || 5000




app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold )
    )
