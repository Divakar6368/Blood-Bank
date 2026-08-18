const express=require('express');
const adminMiddleware=require('../Middleware/adminMiddleware')
const {setstoredata,storeinfo,setsample,updatesample}=require('../Components/adminpanel')
const adminRoute=express.Router();


adminRoute.post('/setstore',adminMiddleware,setstoredata);
adminRoute.get('/storeinfo',adminMiddleware,storeinfo);
adminRoute.post('/setsample/:id',adminMiddleware,setsample);
adminRoute.put('/updatestock/:id',adminMiddleware,updatesample);

module.exports=adminRoute;