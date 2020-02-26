const ErrorREsponse = require('../utils/errorResponse')


const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')


exports.getCourses = async(req,res,next)=>{
    let query
    if(req.params.bootcampId){
        const courses = await  Course.find({bootcamp: req.params.bootcampId})

        return res.status(200).json({
            sucess:true,
            count:courses.length,
            data: courses
        })
    }else{
       res.status(200).json(res.advancedResults)
    }

const courses = await query 
 
res.status(200).json({
    sucess:true,
    count:courses.length,
    data:courses
})

}
exports.getCourse = async(req,res,next)=>{
  const course = await Course.findById(req.params.id).populate({
      path:'bootcamp',
      select:'name description'
}) 
if(!course){
    return next(
        new ErrorREsponse(`No course with id of ${req.params.id}`),404
    )
}
       

res.status(200).json({
    sucess:true,
    data:course
    
})

}
exports.addCourse = async(req,res,next)=>{
    req.body.bootcamp = req.params.bootcampId
    req.body.user = req.user.id
    const bootcamp = await Bootcamp.findById(req.params.bootcampId).populate({
        path:'bootcamp',
        select:'name description'
  }) 
  if(!bootcamp){
      return next(
          new ErrorREsponse(`No bootcamp with id of ${req.params.bootcampId}`),404
      )
  } 
  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin' ){
    return next( new ErrorREsponse(`User ${req.user.id} not authorized to add a course to bootcamp`,404))
 }



  const course = await Course.create(req.body)
         
  
  res.status(200).json({
      sucess:true,
      data:course
      
  })
  
  }
  exports.updateCourse = async(req,res,next)=>{
   
    let course = await Course.findById(req.params.id)
   
  if(!course){
      return next(
          new ErrorREsponse(`No  with id of ${req.params.bootcampId}`),404
      )
  }

  course = await Course.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true
  })
  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin' ){
    return next( new ErrorREsponse(`User ${req.user.id} not authorized to update a course ${course._id} to bootcamp`,404))
 }

  
  res.status(200).json({
      sucess:true,
      data:course
      
  })
  
  }
  exports.deleteCourse = async(req,res,next)=>{
   
    const course = await Course.findById(req.params.id)
   
  if(!course){
      return next(
          new ErrorREsponse(`No  with id of ${req.params.bootcampId}`),404
      )
  }
  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin' ){
    return next( new ErrorREsponse(`User ${req.user.id} not authorized to remove  course ${course._id} to bootcamp`,404))
 }


     await course.remove()
  
  res.status(200).json({
      sucess:true,
      data:course
      
  })
  
  }
