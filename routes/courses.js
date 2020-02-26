
const express = require('express')
const {
  getCourses,getCourse,addCourse,updateCourse} = require('../controllers/courses')
  const {protect,authorize} =require('../middleware/auth') 


const Course = require('../models/Course')
const advancedResults = require('../middleware/advancedResult')

const router = express.Router({mergeParams:true})

router.route('/')
.get(advancedResults(Course,{
  path:'bootcamp',
  select:'name description'
}),getCourses)
.post(protect,authorize('publisher','admin'),addCourse)
router.route('/:id').get(getCourse).put(protect,authorize('publisher','admin'),updateCourse)

module.exports = router


