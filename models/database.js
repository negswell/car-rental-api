let mongoose = require('mongoose') 

const URI= process.env.MONGODB_URI

console.log(URI) ;
mongoose.connect(URI,{useNewUrlParser: true, useUnifiedTopology: true}) ;

exports.mongoose=mongoose ;
