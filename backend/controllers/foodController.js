import foodModel from "../models/foodModel.js";
import fs from 'fs'
import mongoose from "mongoose";
import path from 'path';
// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({})
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}

// add food
const addFood = async (req, res) => {

    try {
        let image_filename = `${req.file.filename}`

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category:req.body.category,
            image: image_filename,
            rating: req.body.rating,
        })

        await food.save();
        res.json({ success: true, message: "Food Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// delete food
const removeFood = async (req, res) => {
    try {

        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => { })

        await foodModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Food Removed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }

}


// Edit a food item
const editFood = async (req, res) => {
    try {
        const { id } = req.body;

        // Validate the ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid food ID" });
        }

        const food = await foodModel.findById(id);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found",
            });
        }

        // If a new image is uploaded, delete the old image and update
        if (req.file) {
            const newImage = req.file.filename;
            if (food.image) {
                const oldImagePath = path.join('uploads', food.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); // Delete old image
                }
            }
            food.image = newImage; // Assign the new image
        }

        // Update other fields
        food.name = req.body.name || food.name;
        food.price = req.body.price || food.price;
        food.description = req.body.description || food.description;
        food.category = req.body.category || food.category;
        food.rating = req.body.rating || food.rating;

        // Save updated food item
        await food.save();
        res.json({ success: true, message: "Food item updated successfully" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error updating food item: ${error.message}`,
        });
    }
};

export { listFood, addFood, removeFood , editFood}