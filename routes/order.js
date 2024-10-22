const router = require("express").Router();
const {authentucateToken}=require("./userAuth");
const Book=require("../models/book");
const Order= require("../models/order");
const order = require("../models/order");
const { populate } = require("../models/user");
// place order
router.post("place-order",authentucateToken,async(req,res)=>{
    try{
       const {id}=req.headers;
       const {Order}=req.body;
     for (const orderData of Order){    
        const newOrder=new Order({user:id,book:orderData._id})
        const orderDatafromDb=await newOrder.save();
        // saving order in user ,odel
        await user.findByIdAndUpdate(id,{$push:{order:orderData._id},});
        // clearing cart
        await user.findByIdAndUpdate(id, { $pull: { cart: orderData._id } });
     }
     return res.status(200).json({
        status:"success",
        message:"order placed successfully"});

    }catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
// get order history of particular user
router.get("/get-order-history",authentucateToken,async(req,res)=>{
    try{
        const {id}=rq.headers;
        const userData=  await user.findById(id).populate({
            path:"orders",
            populate:{path:"book"},
        });
        const orderData=userData.orders.reverse();
        return res.json({
            status:"Success",
            data:"ordersData",
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred" });
    }
});
// get=all-order  --admin
router.get("/get-all-order",authentucateToken,async(req,res)=>{
    try{
        
        const userData=  await Order.find()
        .populate({
            path:"book",
        })
        .populate({
            path:"user",
        })
        .sort({createAt:-1});
        return res.json({
            status:"Success",
            data:"userData",
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred" });
    }
});
// update order --admin
router.put("/update-status/:if",authentucateToken,async(req,res)=>{
    try{
        const { id}=req.params;
        await Order.findByIdAndUpdate(id,{status:req.body.status});
        return res.json({
            status:"Success",
            data:"status updated successfuly",
        });
       
    }catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred" });
    }
});
module.exports = router;
