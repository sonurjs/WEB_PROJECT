const mongoose=require("mongoose");
const Conn=async()=>{
    try{
        await mongoose.connect(`${process.env.URI}`);
        console.log("connected to database")
    }catch(error){
        console.log(error);

    }

}
Conn();