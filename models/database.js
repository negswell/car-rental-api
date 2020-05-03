let mongoose = require('mongoose') 

const URI= process.env.URI || 'mongodb://heroku_vxx40qq7:f185n9vbmv2l1i54e61e92vn6q@ds133875.mlab.com:33875/heroku_vxx40qq7'

console.log(URI) ;
mongoose.connect(URI,{useNewUrlParser: true, useUnifiedTopology: true}) ;

exports.mongoose=mongoose ;
