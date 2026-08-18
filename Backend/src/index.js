require('dotenv').config()
const express=require('express')
const app=express();
const main=require('../config/main')
const redisClient=require('../config/redis');
const userRouter = require('../Routes/userRoutes');
const medicalRouter=require('../Routes/medicalRoutes')
const cookieParser = require('cookie-parser')
const cors = require('cors');
const adminRoute = require('../Routes/adminRoutes');



app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}))

app.use('/user',userRouter);
app.use('/info',medicalRouter);
app.use('/admin',adminRoute);



const InitalizeConnection=async()=>{
    try{
        await Promise.all[main(),redisClient.connect()];
        console.log("DB Connected");
        app.listen(process.env.PORT,async()=>{
            console.log("Listening at port "+process.env.PORT)
        })
    }
    catch(err){
        
        console.log(err.message);
    }
}
InitalizeConnection();