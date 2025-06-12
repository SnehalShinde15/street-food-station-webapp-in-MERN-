import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//config variables
const currency = "inr";
const deliveryCharge = 50;
const frontend_URL = 'http://localhost:5174';

// Placing User Order for Frontend using stripe
const placeOrder = async (req, res) => {
    try {
        // Check if Stripe key is valid
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "superkey123") {
            console.error("Invalid Stripe secret key");
            return res.status(500).json({ 
                success: false, 
                message: "Payment processing is currently unavailable. Please try cash on delivery." 
            });
        }

        // Create the order first
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            isDineIn: req.body.isDineIn,
            tableReservation: req.body.tableReservation
        });
        
        // Save the order
        await newOrder.save();
        console.log("Order created successfully:", newOrder._id);
        
        // Clear the user's cart
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
        console.log("User cart cleared");

        // Prepare line items for Stripe
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 
            },
            quantity: item.quantity
        }));

        // Add delivery charge
        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charge"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        });

        console.log("Prepared line items for Stripe:", line_items);

        try {
            // Create Stripe session
            console.log("Creating Stripe session...");
            const session = await stripe.checkout.sessions.create({
                success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
                cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
                line_items: line_items,
                mode: 'payment',
            });
            console.log("Stripe session created successfully");

            res.json({ success: true, session_url: session.url });
        } catch (stripeError) {
            console.error("Stripe error:", stripeError);
            // Delete the order if Stripe fails
            await orderModel.findByIdAndDelete(newOrder._id);
            console.log("Order deleted due to Stripe error");
            
            res.status(500).json({ 
                success: false, 
                message: "Payment processing failed. Please try cash on delivery.",
                error: stripeError.message
            });
        }
    } catch (error) {
        console.error("Order placement error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to place order. Please try again.",
            error: error.message
        });
    }
}

// Placing User Order for Frontend using stripe
const placeOrderCod = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            isDineIn: req.body.isDineIn,
            tableReservation: req.body.tableReservation,
            payment: true
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const updateStatus = async (req, res) => {
    console.log(req.body);
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }

}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        res.json({ success: false, message: "Not  Verified" })
    }

}

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod }