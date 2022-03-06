const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const dbConnectionURL = process.env.DB_CONNECTIONS


//Midelware 
app.use(express.json());
app.use(cors())

const userRoutes = require('./route/usersRoute');
const pizzaRoutes = require('./route/pizzasRoute');
const orderRoutes = require('./route/ordersRoute')
//Routes 
app.use('/api/users',userRoutes);
app.use('/api/pizzas',pizzaRoutes);
app.use('/api/orders',orderRoutes);



//DATABASE CONNCTION 
mongoose.connect(dbConnectionURL,{useNewUrlParser: true})

const db = mongoose.connection ;
db.on('connected',()=>{
  console.log("Mongo DB Connection Successfull")
});
db.on("error",()=>{
    console.log("Mongo DB Connection Failed")
})


const port = process.env.PORT || 5000
app.listen(port,()=>{
console.log("8000 Server is running! ")
});