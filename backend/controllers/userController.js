import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import mongoose from "mongoose";

import { OAuth2Client } from 'google-auth-library';





// Fetch all users
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching users" });
    }
};

// Delete a specific user by ID
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error deleting user" });
    }
};




//login user
const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"User not found"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"Invalid credentials"});
        }
        const token = createToken(user._id);
        res.json({success:true,token}); 

    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error in login user"});
    }
}

const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//register user
const registerUser = async (req, res) => {
    const {name, email, password} = req.body;
    try{
        console.log("Attempting to register user:", { name, email });
        
        //checking if user already exists
        console.log("Checking for existing user with email:", email.toLowerCase());
        const exists = await userModel.findOne({email: email.toLowerCase()});
        if(exists){
            console.log("User already exists with email:", email);
            return res.json({success:false,message:"User already exists"});
        }

        //validating email and strong password 
        if(!validator.isEmail(email)){
            console.log("Invalid email format:", email);
            return res.json({success:false,message:"Invalid email"});
        }
        
        if(password.length < 8){
            console.log("Password too short");
            return res.json({success:false,message:"Password must be at least 8 characters"});
        }

        //hasing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //new user creation
        const newUser = new userModel({
            name, 
            email: email.toLowerCase(), 
            password: hashedPassword
        });
        
        console.log("Attempting to save new user to database");
        console.log("Mongoose connection state:", mongoose.connection.readyState);
        const user = await newUser.save();
        console.log("User saved successfully. User ID:", user._id);
        console.log("User details:", {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        });

        const token = createToken(user._id);
        res.json({success:true,token});

        
    }catch(error){
        console.log("Error in registering user:", error);
        console.log("Error details:", {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        res.json({success:false,message:"Error in registering user: " + error.message});
    }
}


//google login
const googleLogin = async (req, res) => {
    const { token } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const { email, name } = payload;

        let user = await userModel.findOne({ email });
        if (!user) {
            // Create a new user if they don't exist
            user = new userModel({ name, email, password: 'googleAuth' });
            await user.save();
        }

        const jwtToken = createToken(user._id);
        res.json({ success: true, token: jwtToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error in Google login" });
    }
}





//admin login
//admin login
// const adminLogin = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await userModel.findOne({ email, isAdmin: true });
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Admin not found"
//             });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid credentials"
//             });
//         }

//         const token = createToken(user._id);
//         res.json({ success: true, token });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Error in admin login" });
//     }
// }

export {loginUser, registerUser, googleLogin, getAllUsers, deleteUser};

