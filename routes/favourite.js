const router = require("express").Router();
const user = require("../models/user");
const {authentucateToken}=require("./userAuth");
//add book to favroite
router.put("add-to-fav",authentucateToken,async(req,res)=>{
    try{
       const {bookid,id}=req.headers;
       const userData=await user.findById(id); 
        const isBookFav=userData.favourites.includes(bookid);
        if(isBookFav){
            return res.status(200).json({message:"book is already in favourties"});
        }
        await user.findByIdAndUpdate(id,{$push:{favourites:bookid}});
        return res.status(200).json({message:"book added to   favourties"});

    }catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
//delete book from favroite
router.put("remove-from-fav", authentucateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await user.findById(id); 
        const isBookFav = userData.favourites.includes(bookid);
        
        if (isBookFav) {
            await user.findByIdAndUpdate(id, { $pull: { favourites: bookid } });
        }

        return res.status(200).json({ message: "Book removed from favourites" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
// get fav books of a particular user
router.get("/get-fav-book",authentucateToken,async(req,res)=>{
    try{
        const {id}=rq.headers;
        const userData=  await user.findById(id).populate("favourties");
        const favouriteBooks=userData.favourites;
        return res.json({
            status:"Success",
            data:"favouriteBooks",
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred" });
    }
});

module.exports = router;                    