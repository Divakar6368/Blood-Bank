const express=require('express');
const adminMiddleware=require('../Middleware/adminMiddleware')
const {setstoredata,storeinfo,setsample,updatesample, getsampleinfo}=require('../Components/adminpanel')
const adminRoute=express.Router();


adminRoute.post('/setstore',adminMiddleware,setstoredata);
adminRoute.get('/storeinfo',adminMiddleware,storeinfo);
adminRoute.post('/setsample/:id',adminMiddleware,setsample);
adminRoute.put('/updatestock/:id',adminMiddleware,updatesample);
adminRoute.get('/getsample/:id',adminMiddleware,getsampleinfo);

module.exports=adminRoute;