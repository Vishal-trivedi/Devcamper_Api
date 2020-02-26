const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')


dotenv.config({path:'./config/config.env'})

const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')
const User = require('./models/User')
const Review = require('./models/Review')
const connectDB = async ()=>{
    const conn = await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:false,
        useUnifiedTopology:true
    })
}

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'))
const users  = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'))
const reviews  = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`,'utf-8'))
const importData = async()=>{
    try{
        await Bootcamp.create(bootcamps)
        await Courses.create(courses)
        await Users.create(users)
        await Review.create(reviews)

        console.log('Data Imported...'.green.inverse)
    }catch(err){
        console.log(err)
    }
}
const deleteData = async()=>{
    try{
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await Users.deleteMany()
        await Review.deleteMany()
        console.log('Data deleted...'.red.inverse)
    }catch(err){
        console.log(err)
    }
}

if(process.argv[2]==='-i'){
    importData()
}
else if(process.argv[2]==='-d'){
    deleteData()
}

