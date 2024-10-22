const router = require("express").Router();
const user = require("../models/user");
const {authentucateToken}=require("./userAuth");
//add to cart
router.put("add-to-cart",authentucateToken,async(req,res)=>{
    try{
       const {bookid,id}=req.headers;
       const userData=await user.findById(id); 
        const isBookCart=userData.cart.includes(bookid);
        if(isBookCart){
            return res.status(200).json({
                status:"success",
                message:"book is already in cart",});
        }
        await user.findByIdAndUpdate(id,{$push:{cart:bookid}});
        return res.status(200).json({
            status:"success",
            message:"book added to   favourties"});

    }catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
// remove from cart
router.put("remove-from-cart/:id", authentucateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await user.findById(id); 
        
            await user.findByIdAndUpdate(id, { $pull: { cart: bookid } });
        

        return res.status(200).json({ 
            status:"success",
            message: "Book removed from cart" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
// get fav books of a particular user
router.get("/get-user-cart",authentucateToken,async(req,res)=>{
    try{
        const {id}=rq.headers;
        const userData=  await user.findById(id).populate("cart");
        const cart=userData.cart.reverse();
        return res.json({
            status:"Success",
            data:"cart",
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred" });
    }
});
module.exports = router;