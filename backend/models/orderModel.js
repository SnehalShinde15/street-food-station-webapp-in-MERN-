import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {type:String,required:true},
    items: { type: Array, required:true},
    amount: { type: Number, required: true},
    address:{type:Object,required:true},
    status: {type:String,default:"Food Processing"},
    date: {type:Date,default:Date.now()},
    payment:{type:Boolean,default:false},
    isDineIn: {type:Boolean, default:false},
    tableReservation: {
        tableNumber: {type:String},
        tableSize: {type:Number},
        numberOfPeople: {type:Number},
        date: {type:Date},
        time: {type:String}
    }
})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;