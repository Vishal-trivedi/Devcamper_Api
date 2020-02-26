const ErrorREsponse = require('../utils/errorResponse')

const User = require('../models/User')


exports.getUsers = async (req,res,next) =>{
   
 res.status(200).json(res.advancedResults)
   
 }


 
exports.getUser= async (req,res,next) =>{
    const user = await User.findById(req.params.id)
    

 res.status(200).json({
     sucess:true,
     data:user
 })
    
 }
 
exports.createUser = async (req,res,next) =>{
const user = await User.create(req.body)

res.status(201).json({
    sucess:true,
    data:user
})
}

exports.updateUser = async (req,res,next) =>{
   const user = await User.findByIdAndUpdate(req.params.id,req.body,{
       new:true,
       runValidators:true
   })
   res.status(201).json({
       sucess:true,
       data:user
   })
    
 }
 exports.deleteUser = async (req,res,next) =>{
    const user = await User.findByIdAndDelete(req.params.id)
   
    res.status(201).json({
        sucess:true,
        data:{}
    })
     
  }



