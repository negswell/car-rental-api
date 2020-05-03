const {CarsModel}=require('../models/cars.model')
const {BookingModel}=require('../models/bookings.model')
const express=require('express') 
const router=express.Router() 
const moment=require('moment')

router.get('/cars',(req,res) => {
    CarsModel.find()
        .then( cars =>{
            res.status(200).json(cars)
        })
        .catch(err => {
            res.status(401).json({
                error: err.message 
            })
        })

})

router.post('/cars',(req,res) => {
    if(!req.body) {
        return res.status(400).json({error:'Post request does not have a body'})}
    const model=new CarsModel(req.body)
    model.save()
        .then(doc =>{
            res.status(201).send(doc)
        })
        .catch(err =>{
            res.status(500).json({
                error:err.message
            })
        })

})


router.post('/cars/book',(req,res) => {
    if(!req.body){
        return res.status(400).json({error:'Post request does not have a body.'})
    }
    CarsModel.findOne({vehicle_number:req.body.vehicle_number})
        .then(car =>{
            if(!car){
                
                return res.status(500).json({
                error:'this car does not exist'
    
            })
            }
            console.log(car.booking_details.status)
            const model= new BookingModel(req.body)
            model.save()
                .then(doc =>{
                    res.status(201).send(doc)

                })
                .catch(err =>{
                    res.status(500).json({
                        error:err.message
                    })
                })
        })

        .catch(err => {
            return res.status(500).json({
                error:'this car does not exist'
            })

        })


})


// req looks like {filters:{filter:values}}

// router.post('/cars/book/filter',(req,res) =>{
//     if (!req.body || !req.body.filter) return res.status(400).send("Request does not have a body or filter")
//     res.json(req.body)

    // CarsModel.find({})

// })

router.get('/cars/book/seats/:value',(req,res) =>{

CarsModel
    .find({seating_capacity:req.params.value})
    .select('vehicle_number model seating_capacity rent_per_day')
    .then(cars =>{
        console.log(cars)
        let vehicle=[]
        cars.forEach(car =>{
            console.log(car.booking_details.status)
            if (!car.booking_details.status) {
            vehicle.push(car)
        }
        })
        console.log(vehicle)
        if (vehicle.length !=0 ) {
            return res.status(200).json(vehicle)}
        else{

            return res.status(404).json({
                error:"No car found"
            })
        }
            
    })
    .catch(err => {
        console.log(err.message)
        return res.status(501).json({
            error:err.message
        })
    })
})

router.get('/cars/book/rent/:value',(req,res) =>{

    CarsModel
        .find({rent_per_day:req.params.value})
        .select('vehicle_number model seating_capacity rent_per_day')
        .then(cars =>{
            console.log(cars)
            let vehicle=[]
            cars.forEach(car =>{
                console.log(car.booking_details.status)
                if (!car.booking_details.status) {
                vehicle.push(car)
            }
            })
            console.log(vehicle)
            if (vehicle.length !=0 ) {
                return res.status(200).json(vehicle)}
            else{

                return res.status(404).json({
                    error:"No car found"
                })
            }
                
        })
        .catch(err => {
            console.log(err.message)
            return res.status(501).json({
                error:err.message
            })
        })


})

router.get('/cars/book/date',(req,res) => {
    let date=moment(req.query.value, "DD.MM.YYYY").toDate();
    console.log(date)
    BookingModel
        .find( {booking_date:{$ne:date}}  )
        .then( cars => {
            console.log(cars)
            if (cars.length==0) return res.status(404).json({error:"No car found"}) 
            let vnumbers= new Set()
            cars.forEach(car =>{
                vnumbers.add(car.vehicle_number)
            })
            console.log(vnumbers)
            CarsModel
                .find()
                .where('vehicle_number')
                .in(Array.from(vnumbers))
                .select('vehicle_number model seating_capacity rent_per_day')
                .then( car =>{
                    console.log(car)
                    return res.status(200).json(car)
                })
                .catch( err =>{
                    return res.status(500).json({error:err.message})
                })
            

        })
        .catch(err => {
            return res.status(500).json({error:err.message})

        })
})

router.get('/cars/book/time',(req,res) => {
    let time = moment(req.query.value, "DD.MM.YYYY HH.mm").toDate();
    console.log(time)
    BookingModel
        .find({from:{"$gt":time},to:{"$lt":time}})
        .then( cars => {
           console.log(cars)
           if (cars.length==0) return res.status(404).json({error:"No car found"}) 
           let vnumbers= new Set()
           cars.forEach(car =>{
               vnumbers.add(car.vehicle_number)
           })
           console.log(vnumbers)
           CarsModel
               .find()
               .where('vehicle_number')
               .in(Array.from(vnumbers))
               .select('vehicle_number model seating_capacity rent_per_day')
               .then( car =>{
                   console.log(car)
                   return res.status(200).json(car)
               })
               .catch( err =>{
                   return res.status(500).json({error:err.message})
               })      
        })
        .catch(err => {
            return res.status(500).json({error:err.message})

        })
})



router.get('/cars/:vehicle_number',(req,res) => {
    const vnumber=req.params.vehicle_number
    CarsModel
    .findOne({vehicle_number:vnumber})
    .then( cars =>{
        return res.status(200).json(cars)
    })
    .catch(err => {
        return res.status(401).json({
            error: err.message 
        })
    })

})

router.patch('/cars/:vehicle_number',(req,res) => {
    const vnumber = req.params.vehicle_number
    CarsModel
        .findOne({vehicle_number:vnumber})
        .then( car =>{
            if (car.booking_details.status) return res.status(500).json({error:"Car is currently active can't update"})

            const update_values={}
            for(let count of req.body){
                update_values[count.key]=count.value  //req will be a list of json 
            }
            console.log(update_values)
            CarsModel
            .updateMany({vehicle_number:vnumber},{$set:update_values})
            .then( patch => {
                return res.status(200).json(patch)
            })
            .catch(err => {
                return res.status(500).json({
                    error:err.message
                })

            })
         })
        .catch( err => {
            return res.status(500).json({error:err.message})
        })

})

router.delete("/cars/:vehicle_number",(req,res) => {
    const vnumber=req.params.vehicle_number
    console.log(vnumber)
    CarsModel
        .findOne({vehicle_number:vnumber})
        .then( car => {
            if (car.booking_details.status) return res.status(500).json({error:"Car is currently active can't update"})
            CarsModel
                .deleteOne({vehicle_number:vnumber})  
                .then( result => {
                    return res.status(200).json(result)
                })
                .catch(err => {
                    return res.status(500).json({error:err.message})
                })


        }) 
        .catch( err => {
            return res.status(500).json({error:err.message})
        })
})
module.exports=router 

