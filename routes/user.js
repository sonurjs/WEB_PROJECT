const router = require("express").Router();
const user = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {authentucateToken}=require("./userAuth");

// signup
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        // Check if username length is more than 4
        if (username.length < 4) {
            return res
                .status(400)
                .json({ message: "Username length should be greater than 3" });
        }

        // Check if username already exists
        const existingUsername = await user.findOne({ username: username });
        if (existingUsername) {
            return res
                .status(400)
                .json({ message: "Username already exists" });
        }

        // Check if email already exists
        const existingEmail = await user.findOne({ email: email });
        if (existingEmail) {
            return res
                .status(400)
                .json({ message: "Email already exists" });
        }

        // Check password length
        if (password.length <= 5) {
            return res
                .status(400)
                .json({ message: "Password length should be greater than 5" });
        }

        // Hash password
        const hashPass = await bcrypt.hash(password, 10);
        const newUser = new user({
            username: username,
            email: email,
            password: hashPass,
            address: address,
        });

        await newUser.save();
        return res.status(200).json({ message: "SignUp successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// signin
router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const existingUser = await user.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const match = await bcrypt.compare(password, existingUser.password);
        if (match) {
            const authClaims = [
                { name: existingUser.username },
                { role: existingUser.role },
            ];
            const token = jwt.sign({ authClaims }, "bookstore123", { expiresIn: "30d" });

            return res.status(200).json({
                id: existingUser._id,
                role: existingUser.role,
                token: token,
            });
        } else {
            return res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
//get user_information
router.get("/get-user-information",authentucateToken,async(req,res)=>{
    try{
        const {id}=req.headers;
        const data=await user .findById(id);//.select('-password');
        return res.status(200).json(data);
    }catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
//update address

router.put("/update-address",authentucateToken,async(req,res)=>{
    try{
        const {id}=req.headers;
        const {address}=req.body;
        await user.findByIdAndUpdate(id,{address:address});
        return res.status(200).json({message:"address updated successfully"});


    }catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})
module.exports = router;
