const express = require('express');
const bodyParser=require('body-parser');
const app=express();
const morgan = require('morgan')
const mongoose=require('mongoose')
const Product =require('./model/products')
const productsRoutes=require('./routers/products')
const categoriesRoutes=require('./routers/category')
const userRoutes=require('./routers/user')
const orderRoutes = require('./routers/order')
const cors=require('cors');
const authJwt = require('./helper/jwt');
const errorHandler =require('./helper/error-handler')
require('dotenv/config');

//environmental variables
const api=process.env.API_URL;


//middlewares

app.use(bodyParser.json());

app.use(morgan('tiny'));
// app.use(authJwt);
// app.use(errorHandler);
app.use(cors());
app.options('*',cors())
// app.use(`${api}/products`,productsRouter)


//routes
app.use(`${api}/products`,productsRoutes);
app.use(`${api}/categories`,categoriesRoutes);
app.use(`${api}/users`,userRoutes);
app.use(`${api}/orders`,orderRoutes);



//connection
mongoose.connect(process.env.CONNECTION_URL)
.then(()=>{
    console.log('database connection is successfull..')
})
.catch((err)=>{
    console.log(err)
})


//server listening
app.listen(3000,()=>{
    console.log(`server is running on port number http://localhost:3000`);
    // console.log(api);
})