const express=require('express');
const userMiddleware = require('../Middleware/userMiddleware');
const {setmedicalinfo, getmedicalinfo}=require('../Components/mediinfo')
const medicalRouter=express.Router();

medicalRouter.post('/medical',userMiddleware,setmedicalinfo)

medicalRouter.get('/medicalinfo',userMiddleware,getmedicalinfo)

module.exports=medicalRouter;