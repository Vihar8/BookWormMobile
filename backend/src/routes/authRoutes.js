import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "15d"});
}

router.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
        const user = new User({
            email,
            username,
            password,
            profileImage,
        });

        await user.save();

        const token = generateToken(user._id);

        return res.status(201).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
});


router.post("/login", async (req, res) => {
    try{
        const {email, password} = req.body;

        if (!email || !password) return res.status(400).json({message: "All fields are required"});

        const user = await User.findOne({email});
        if(!user) return res.send(400).json({message: "User does not exist"});

        const isPasswordCorrect = await user.comparePassword(password);

        if(!isPasswordCorrect) return res.status(400).json({message: "invalid credential"})

        const token = generateToken(user._id);

        return res.status(201).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        });
        
    }catch(error){
        console.error("Registration error:", error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
})

export default router;