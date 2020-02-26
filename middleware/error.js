const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err,req,res,next) =>{

    let error = {...err}
    //console.log(res.stack.red)
    
if(err.name === 'CastError'){
    const message = `Resource not found with id of ${err.value}`
    error = new ErrorResponse(message,404)
}

if(err.code === 11000){
    const message = 'Duplicate field value entered'
    error = new ErrorResponse(message,404)
}
console.log(err)

if(err.name === 'ValidationError'){
    const message = Object.values(err.errors).map(val=>val.message)
    error = new ErrorResponse(message,404)
}

res.status(error.statusCode || 500).json({
    sucess:false,
    error:error.message || 'Server Error'
})


}




module.exports = errorHandler

