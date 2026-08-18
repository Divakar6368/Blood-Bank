const mongoose=require('mongoose')
async function main(){
    try{
        await mongoose.connect(process.env.DB_CONN_STRING);
    }
    catch(err){
        console.log("ERROR"+err.message)
    }
}
module.exports=main;

