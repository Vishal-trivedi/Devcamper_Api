const mongoose = require("mongoose")
const slugify = require("slugify")
const geocoder = require('../utils/geocoder')

const BootcampSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a name.'],
        unique:true,
        trim:true,
        maxlength:[50,'Name can not be more than 50 characters']
    },
    slug:String,
    description:{
        type:String,
        required:[true,'PLease add a description'],
        trim: true,
        maxlength:[500,'Description can not be more than 500 characters']
    },
    website:{
        type:String,
        match:[
            /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/,
            'PLease use a valid URL with HTTP or HTTPS'
        ]
    },
    phone:{
        type:String,
        maxlength:[20,'Phone no can not be greater than 20 characters']
    },
    email:{
        type:String,
        match:[
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'please add a valid name'
    
        ]
    },
    address:String,
    location:{
        type:{
        type:String,
        enum:['Point'],
       // required:true
    },
    coordinates:{
        type:[Number],
       // required:true,
        index:'2dsphere'

    },
    formattedAddress:String,
    street:String,
    state:String,
    zipcode:String,
    country:String
},
careers:{
    type:[String],
    required:true,
    /*enum:[
        'Web development',
        'Mobile development',
        'UI/UX',
        'Data Science',
        'Business',
        'Other'
    ]*/
},
averageRating:{
    type:Number,
    min:[1,'Rating must be at least 1'],
    max:[10,'Rating can not be more than 10']
},
averageCost:Number,
photo:{
    type:String,
    default:'no-photo.jpg'
},
housing:{
    type:Boolean,
    default:false
},
jobAssistance:{
    type:Boolean,
    default:false
},
jobGuarantee:{
    type:Boolean,
    default:false
},
acceptGi:{
    type:Boolean,
    default:false
},
createdAt:{
    type:Date,
    default:Date.now
},
user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required: true
}




},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}  
  })

BootcampSchema.pre('save',function(next){
 this.slug = slugify(this.name,{lower:true})
 next()
})

BootcampSchema.pre('save',async function(next){
    const loc = await geocoder.geocode(this.address)
    this.location = {
        type:'point',
        coordinates:[loc[0].longitude,loc[0].latitude],
        formattedAddress:loc[0].formattedAddress,
        street:loc[0].streetName,
        city:loc[0].city,
        state:loc[0].stateCode,
        zipcode:loc[0].countryCode
    } 
    this.address = undefined
    next()
})
BootcampSchema.pre('remove',async function(next){
    console.log(`Courses being removed from bootcamp ${this._id}`)
    await this.model('Course').deleteMany({bootcamp:this._id})
    next()
})
  
BootcampSchema.virtual('courses',{
    ref:'Courses',
    localField:'_id',
    foreignField:'bootcamp',
    justOne:false
})  

module.exports = mongoose.model('Bootcamp',BootcampSchema)