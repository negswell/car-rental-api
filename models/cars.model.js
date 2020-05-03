const {mongoose} = require("./database") 

let CarsSchema=new mongoose.Schema({
    vehicle_number:{type:String,trim:true,required:true,unique:true},
    model:{type:String,trim:true,required:true},
    seating_capacity:{type:Number,trim:true,required:true},
    rent_per_day:{type:Number,trim:true,required:true},
    booking_details:{
        status:{type:Boolean,trim:true,default:false},
        name:{type:String,trim:true},
        phone:{type:Number,trim:true},
        issue_date:{type:Date,trim:true},
        return_date:{type:Date,trim:true}
    },
   schedule:[{type:mongoose.Schema.Types.ObjectId,ref:'Bookings'}]

}) ;
exports.CarsModel=mongoose.model('Cars',CarsSchema) 




// schedule:{type:mongoose.Schema.Types.ObjectId,ref:'Bookings'}