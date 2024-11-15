import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {type : String, required:true},
    email : {type : String, required:true},
    password : {type : String},
    googleId: { type: String },
    isAdmin : {type : Boolean, default : false},
    isActive : {type : Boolean, default : true},
    createdAt : {type : Date, default : Date.now},
    updatedAt : {type : Date, default : Date.now},
    cartData : {type : Object, default : {}},
},{minimize : false})

const userModel = mongoose.models.user || mongoose.model("user",userSchema);

export default userModel;