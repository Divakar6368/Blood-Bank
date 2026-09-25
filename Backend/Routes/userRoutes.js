const express=require('express')
const userRouter=express.Router();
const userMiddleware=require('../Middleware/userMiddleware')
const adminMiddleware=require('../Middleware/adminMiddleware')
const {registeruser,loginuser,logoutuser,BeAdmin, updateUserName}=require('../Components/userAuth')




userRouter.post('/register',registeruser);
userRouter.post('/login',loginuser);
userRouter.post('/logout',userMiddleware,logoutuser);
userRouter.post('/updatename',userMiddleware,updateUserName);
userRouter.post('/admin',BeAdmin);
userRouter.get('/check',userMiddleware,(req,res)=>{
    // console.log(req.result)
     const reply = {
       Name:req.result.Name,
      emailId: req.result.emailId,
      _id: req.result._id,
      role: req.result.role,
      Location: req.result.Location,
    }
    res.status(200).json({
        user:reply,
        message:"Valid User"
    });

})



module.exports=userRouter;