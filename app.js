const express=require("express");
const app=express();

require("dotenv").config();
require("./connection/conn");
const user =require("./routes/user");
const Books=require("./routes/book")
const Favorite=require("./routes/favourite")
const Cart=require("./routes/cart")
const Order=require("./routes/order")




app.use(express.json());
//routes
app.use("/api/v1/",user);
app.use("/api/v1/",Books);
app.use("/api/v1/",Favorite);
app.use("/api/v1/",Cart);
app.use("/api/v1/",Order);




// creating port
app.listen(process.env.PORT||1000,()=>{
    console.log(`server started at port ${process.env.PORT}`);
})