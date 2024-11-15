import mongoose from "mongoose";    

export const connectDB =async()=>{
    await mongoose.connect('mongodb+srv://admin:12345@cluster0.iu3b2ph.mongodb.net/FOOD-DELIVERY?retryWrites=true&w=majority').then(()=>console.log("DB connected"));
}