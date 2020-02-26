const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
const sendEmail = require('../utils/sendEmail')


exports.register = async (req,res,next) =>{
   const {name,email,password,role} = req.body

   const user  =await User.create({
       name,
       email,
       password,
       role
   })
   sendTokenResponse(user,200,res)
  
}
exports.login = async (req,res,next) =>{
    const {name,email,password,role} = req.body
    const user = await User.findOne({email}).select('+password')

    if(!user){
        return next(new ErrorResponse('Invalid credentials',401))
    }
 
    const isMatch = user.matchPassword(password)
    if(!isMatch){
        return next(new ErrorResponse('Invalid credentials',401))
    }
    sendTokenResponse(user,200,res)
 }

 
 exports.getMe = async(req,res,next)=>{
    const user = await User.findById(re.user.id)
    res.status(200).json({
        sucess:true,
        data:user
    })
    
}

exports.forgotPassword = async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email})
   if(!user){
       return next(new ErrorResponse('There is no response with that email.',404))
   }
   const resetToken = user.getResetPasswordToken()
   await user.save({validateBeforeSave:false})
   const resetUrl =`${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`

   const message = `You are receiving this email because you (or someone else) has requested the reset of a password.Please male a PUT request to: \n\n ${resetUrl}`
   
    try{
        await sendEmail({
            email:user.email,
            subject:'Password reset token',
            message

        })
        res.status(200).json({sucess:true,data:'Email sent'})
    }catch(err){
     console.log(err)
     user.getResetPasswordToken = undefined
     user.resetPasswordExpire = undefined
     await user.save({validateBeforeSave:false})

     return next(new ErrorResponse('Email could not be sent'),500)
    }

   
    res.status(200).json({
        sucess:true,
        data:user
    })
    
}
exports.resetPassword = async(req,res,next)=>{
    const resetPassword = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex')
   
     const user =await User.findOne({
       resetPasswordToken,
       resetPasswordExpire:{$: Date.now()}
         
     })

     if(!user){
         return next(new ErrorResponse('Invalid Token'))
     }

     user.password = req.body.password
     user.resetPasswordToken = undefined
     user.resetPasswordExpire = undefined

     await user.save()
     
  sendTokenResponse(user,200,res)
    
}
exports.updateDetails = async(req,res,next) =>{
    const fieldsToUpdate ={
        name:req.body.name,
        email:req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id,fieldsToUpdate,{
        new:true,
        runValidators:true
    })

    res.status(200).json({
        sucess:true,
        data:user
    })
}
 
exports.updatePassword = async(req,res,next)=>{
    const user = await User.findById(re.user.id).select('+password')

    if(!(await user.matchPassword(req.body.currentPassword))){
        return next(new ErrorResponse('Password is incorrect',401))
    }
    user.password = req.body.newPassword
    await user.save()

    sendTokenResponse(user,200,res)
    
}
exports.logout = async(req,res,next)=>{
  res.cookie('token','none',{
      expires:new Date(Date.now() + 10*1000),
      httpOnly:true

  })

    res.status(200).json({
        sucess:true,
        data:user
    })
    
}













const sendTokenResponse = (user,statusCode,res)=>{
    const token = user.getSignedJwtToken()
   const options = {
       expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
       httpOnly:true         
   }
   if(process.env.NODE_ENV === 'production'){
       options.secure = true
   }

   res
   .status(statusCode)
   .cookie('token',token,options)
   .json({
       sucess:true,
       token
   })

}