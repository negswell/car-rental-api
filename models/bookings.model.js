const {mongoose} = require("./database") ;


let BookingsSchema=new mongoose.Schema({
    vehicle_number:{type:String,trim:true,required:true},
    booking_date:{type:Date,trim:true,required:true},
    from:{type:Date,trim:true,required:true},
    to:{type:Date,trim:true,required:true}
    
})


BookingsSchema.index({vehicle_number:1,booking_date:1,from:1},{unique:true}) 

exports.BookingModel=mongoose.model('Bookings',BookingsSchema)
