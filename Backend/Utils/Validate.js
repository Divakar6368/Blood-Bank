const validator=require('validator');

function Validate(data){
    const mandatoryfields=['Name','emailId','Password'];
    const isAllowed=mandatoryfields.every((k)=>Object.keys(data).includes(k));
    if(!isAllowed)
        throw new Error("Invalid Credentials");
    if(!validator.isEmail(data.emailId))
        throw new Error("Invalid Credentials");
    if(!validator.isStrongPassword(data.Password))
        throw new Error("Invalid Credentials");
}

module.exports=Validate;