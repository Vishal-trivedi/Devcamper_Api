const ErrorResponse = require('../utils/errorResponse')
const advancedResults = require('../middleware/advancedResult')
const Review = require('../models/Review')
const Bootcamp = require('../models/Bootcamp')

exports.getReviews = async (req,res,next) =>{
    try{
    if(req.params.bootcampId){
        const reviews = await Review.find({bootcamp:req.params.bootcampId})

        return res.status(200).json({
            sucess:true,
            count:reviews.length,
            data:reviews
        })
    }
    else{
        res.status(200).json(res.advacedResults)
    }
}catch(err){
    next(err)
}
}
exports.getReview = async (req,res,next) =>{
    try{
    const review = await (await Review.findById(req.params.id)).populate({
        path:'bootcamp',
        select:'name description'
    })

    if(!review){
        return next(new ErrorResponse(`No review found with id of ${req.params.id}`))
    }

    res.status(200).json({
        sucess:true,
        data:review
    })
    
    
}catch(err){
    next(err)
}
}
exports.addReview = async (req,res,next) =>{
    try{
    req.body.bootcamp =req.params.bootcampId
    req.body.user = req.body.id

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if(!bootcamp){
        return next(
            new ErrorResponse(`No bootcamp with id od ${req.params.bootcampId},404`)
        )
    }
    const review = await Review.create(req.body)

    res.status(201).json({
        sucess:true,
        data:review
    })
    
    
}catch(err){
    next(err)
}
}
exports.updateReview = async (req,res,next) =>{
    try{
  

    let review = await Review.findById(req.params.id)

    if(!review){
        return next(
            new ErrorResponse(`No bootcamp with id off ${req.params.bootcampId},401`)
        )
    }

 if(req.user.toString() !== req.user.id && req.user.role !== 'admin'){
     return next(new ErrorResponse(`Not authorized to update review`),404)
 }
   
  review = await Review.findByIdAndUpdate(req.params.id,req.body,{
     new:true,
     runValidators:true
 })

    res.status(201).json({
        sucess:true,
        data:review
    })
    
    
}catch(err){
    next(err)
}
}
exports.deleteReview = async (req,res,next) =>{
    try{
  

    let review = await Review.findById(req.params.id)

    if(!review){
        return next(
            new ErrorResponse(`No bootcamp with id off ${req.params.bootcampId},401`)
        )
    }

 if(req.user.toString() !== req.user.id && req.user.role !== 'admin'){
     return next(new ErrorResponse(`Not authorized to update review`),404)
 }
   
   await review.remove()

    res.status(201).json({
        sucess:true,
        data:{}
    })
    
    
}catch(err){
    next(err)
}
}


