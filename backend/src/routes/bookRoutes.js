import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js"
import proctectRoute from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/", proctectRoute, async(req, res) => {
 try{
    const {title, caption, rating, image} = req.body;

    if (!title || !caption|| !rating|| !image) return res.status(400).json({message: "All fields are required"});

    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url
    const newBook = new Book({
        title,
        caption,
        rating,
        image: imageUrl,
        user: req.user._id,
    })
    await newBook.save()

    res.status(201).json(newBook);
 }  catch(error){
    console.error("Registration error:", error);
    return res.status(500).json({
        message: "Something went wrong"
    });
 } 
})

router.get("/", proctectRoute, async(req, res) => {
    try{
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;


        const books = await Book.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "username profileImage");

        const totalBooks = await Book.countDocuments();

        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit ),
        });
    }catch(error){
        console.error("Registration error:", error);
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
})

router.delete("/:id", proctectRoute, async (req, res) => {
    try{
        const book = await Book.findById(req.params.id);
        if(!book) return res.status(404).json({message: "Book not found"});

        if(book.user.toString() !== req.user._id.toString())
            return res.status(401).json({message: "Unauthorized"});

            //delete image from cloudinart
            if(book.image && book.image.includes("cloudinary")){
                try{
                    const publicId = book.image.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(publicId);

                }catch(error){
                console.error("Registration error:", error);
                }
            }


        await book.deleteOne();

        res.json({message: "Book delete successfully"});
    }catch(error){
        console.error("Registration error:", error);
        return res.status(500).json({
            message: "Something went wrong"});
    }
})

export default router;