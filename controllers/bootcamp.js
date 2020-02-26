const ErrorREsponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder')
const path = require('path')

const Bootcamp = require('../models/Bootcamp')


exports.getBootcamps = async(req,res,next)=>{

   try{
       
      res.status(200).json(res.advancedResults)
   }catch(err){
    next(err)
   }
}

exports.getBootcamp =async (req,res,next)=>{
     try{
         const bootcamp = await Bootcamp.findById(req.params.id)
         if(!bootcamp){
           return next(new ErrorREsponse(`Bootcamp not found with id of ${req.params.id}`,404))
         }
         res.status(200).json({sucess:true,data:bootcamp})
     }catch(err){
         //res.status(400).json({sucess:false})
         next(err)
     }


   
}

exports.createBootcamp =async (req,res,next)=>{

    try{

      res.body.user = req.user.id
      const publishedBootcamp = await Bootcamp.findOne({user:req.user.id})

      if(publishedBootcamp && req.user.role !== 'admin'){
        return next(new ErrorREsponse(`The user with Id ${req.user.id} has already published a bootcamp`))
      }
 
        const bootcamp = await Bootcamp.create(req.body)
        res.status(201).json({
            success:true,
            data:bootcamp
            
    })

    }catch(err){
        next(err)

 
}
}




exports.updateBootcamp = async(req,res,next)=>{
    try{
   let bootcamp = await Bootcamp.findById(req.params.id,req.body,{
       new:true,
       runValidators:true
   })
   if(!bootcamp){
    return next(new ErrorREsponse(`Bootcamp not found with id of ${req.params.id}`,404))
  }
  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin' ){
     return next( new ErrorREsponse(` ${req.params.id} is not authorized to update bootcamp`,404))
  }

  bootcamp = await Bootcamp.findOneAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true
  })



res.status(200).json({sucess:true,data:bootcamp})
    }catch(err){
        next(err)
    }
}
exports.deleteBootcamp = async(req,res,next)=>{
  try{
    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp){
        return next(new ErrorREsponse(`Bootcamp not found with id of ${req.params.id}`,404))
      }
      if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin' ){
        return next( new ErrorREsponse(`${req.params.id} is not authorized to delete this bootcamp`,401))
     }
   
      bootcamp.remove()


    res.status(200).json({sucess:true,data:{}})

  }catch(err){
    next(err)

  }

}
exports.getBootcampsInRadius = async(req,res,next)=>{
  const {zipcode,distance} = req.params
   
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].longitude
  const lng = loc[0].latitude

  const radius = distance/3963
  const bootcamps = await Bootcamp.find({
    location:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}
  })
  res.status(200).json({
    success:true,
    count:bootcamps.length,
    data:bootcamps
  })

} 
exports.bootcampPhtotoUpload = async(req,res,next)=>{
  try{
    const bootcamp = await Bootcamp.findById(req.params.id)
    if(!bootcamp){
        return next(new ErrorREsponse(`Bootcamp not found with id of ${req.params.id}`,404))
      }
      if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin' ){
        return next( new ErrorREsponse(`${req.params.id} not authorized to acess this bootcamp`,404))
     }
   
      if(!req.files){
        return next(new ErrorREsponse(`Please upload a file`))
      }

      const files = req.files.files

      if(!files.mimetype.startsWith('image')){
        return next(new ErrorREsponse(`Please upload an image file`,400))
      }
      if(files.size>process.env.MAX_FILE_UPLOAD){
        return next(new ErrorREsponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD} `,400))

      }
      files.name = `photo_${bootcamp._id}${path.parse(file.name).ext} `
      file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err =>{
        if(err){
          consile.log(err)
          return next(new ErrorREsponse(`Problem with file upload`,500))
        }

        res.status(200).json({
          sucess:true,
          data:file.name
        })
      })
      
    

  }catch(err){
    next(err)

  }

}







