const express=require('express') 
const app=express() 
const carsRoute=require('./routes/cars')
const bodyParser=require('body-parser')

const PORT=process.env.PORT || 3000 ;

app.use(bodyParser.json())

app.use('/api',carsRoute)


app.listen(PORT,() => console.log(`listening at ${PORT}`)) ;




//car booking

