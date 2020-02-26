const jwt = require("jsonwebtoken")
const ErrorREsponse = require('../utils/errorResponse')
const User = require('../models/User')


exports.protect = async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    //else if(req.cookies.token){
      //  token = req.cookies.token
   // }
   if(!token){
       return next(new ErrorREsponse('Not authorize to acess this route',401))
   }
   try{
       const decoded = jwt.verify(token,process.env.JWT_SECRET)
       console.log(decoded) 

       next()

   }catch(err){
    return next(new ErrorREsponse('Not authorize to acess this route',401))
     
   }

}
exports.authorize = (...roles) =>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to acess`,403) )
        }
        next()
    }
}




