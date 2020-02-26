const mongoose =require('mongoose')

const CourSechema = new mongoose.Schema({
    title:{
    type:String,
    trim:true,
    required:[true,'Please add a course']
    },
    description:{
        type:String,
        required:[true,'PLaese add a description']
    },
    weeks:{
        type:String,
        required:[true,'Please add no fo weeks']
    },
    tuition:{
        type:String,
        required:[true,'PLaese add a tuition cost']
    },
    minimumSkill:{
        type:String,
        required:[true,'PLaese add a minimum skill']
    },
    scholarshipAvailable:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref:'Bootcamp',
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    }


})
CourSechema.static.getAverageCost = async function(bootcampId){
  

    const obj = await this.aggregate([
        {
            $match:{bootcamp:bootcampId}
        },{
        $group:{
            _id:'$bootcamp',
            averageCost:{$avg:'$tuition'}
        }
    }
    ])
    try{
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
        averageCost:Math.ceil(obj[0].averageCost/10)*10 
        })
    } catch(err){
        console.error(err)

    }
    


}
CourSechema.pre('save',function(){
    this.constructor.getAverageCost(this.bootcamp)
})
CourSechema.pre('remove',function(){
    this.constructor.getAverageCost(this.bootcamp)
})

module.exports = mongoose.model('Course',CourSechema)