const router = require("express").Router();
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const Book=require("../models/book");
const {authentucateToken}=require("./userAuth");
// add book --admin
router.post("/add-book",authentucateToken,async(req,res)=>{
    try{
        const {id}=req.headers;
        const user=await user.findById(id);
        if(user.role!="admin"){
           return res.status(400).json({message:"dont have access for admin "})
        }
        const book= new Book({
            url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price:req.body.price,
            desc:req.body.desc,
            language:req.body.language,
        });
        await book.save();
        res.status(200).json({message:"books added successfully"});
    }catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
// update book
router.put("/update-book",authentucateToken,async(req,res)=>{
    try{
        const { bookid}=req.headers;
        await Book.findByIdAndUpdate(bookid,  {   
            url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price:req.body.price,
            desc:req.body.desc,
            language:req.body.language,
        });
       
        return res.status(200).json({message:"books added successfully"})
    }catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
// delete books
router.delete("/delete-book", authentucateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred" });
    }
});
// get all books
router.get("/get-all-book",async(req,res)=>{
    try{
        const books=await Book.find().sort({createdAt:1});
        return res.json({
            status:"Success",
            data:books,
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred" });
    }
});
//get recnetly added books limit 4
router.get("/get-recent-book",async(req,res)=>{
    try{
        const books=await Book.find().sort({createdAt:-1}).limit(4);
        return res.json({
            status:"Success",
            data:books,
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred" });
    }
});
// get book by id
router.get("/get-book-by-id/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        const books=await Book.findById(id)
        return res.json({
            status:"Success",
            data:"books",
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred" });
    }
});
module.exports=router;
