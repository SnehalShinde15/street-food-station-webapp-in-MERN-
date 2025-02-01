import mongoose from "mongoose";    

export const connectDB =async()=>{
    await mongoose.connect('-------------your mongo API key here-----------------').then(()=>console.log("DB connected"));
}
