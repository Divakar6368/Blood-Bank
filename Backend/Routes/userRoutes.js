const express=require('express')
const userRouter=express.Router();
const userMiddleware=require('../Middleware/userMiddleware')
const adminMiddleware=require('../Middleware/adminMiddleware')
const {registeruser,loginuser,logoutuser,BeAdmin}=require('../Components/userAuth')




userRouter.post('/register',registeruser);
userRouter.post('/login',loginuser);
userRouter.post('/logout',userMiddleware,logoutuser);
userRouter.post('/admin',BeAdmin);
userRouter.post('/check',userMiddleware);



module.exports=userRouter;