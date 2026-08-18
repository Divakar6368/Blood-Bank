const adminMiddleware=async(req,res,next)=>{
    try {
        const {token}=req.cookies;
        if(!token)
            throw new Error("Token is not persent");
        const payload=jwt.verify(token,process.env.JWT_KEY);
        const {_id}=payload;
        if(!_id)
            throw new Error("Invalid User")
        const result=User.findById(_id);
        if(!result){
            throw new Error("User Doesn't Exist");
        }
        const IsBlocked=await redisClient.exists(`token:${token}`)
        if(IsBlocked)
            throw new Error("Invalid Token");

        if(!result.role==='admin')
            throw new Error("Invalid User")

        req.result=result;
        next();

    } catch (error) {
        res.status(401).send("Error: "+ error)
    }
}


module.exports=adminMiddleware