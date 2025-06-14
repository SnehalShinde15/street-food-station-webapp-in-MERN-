import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRoute from "./routes/orderRoute.js";
import tableRoute from "./routes/tableRoute.js";
import adminRouter from "./routes/adminRoute.js";
import feedbackRoutes from "./routes/feedbackRoute.js";
import 'dotenv/config';

// const feedbackRoutes = require('./routes/feedbackRoute.js');
// App config
const app = express();
const port = process.env.PORT || 5000; // Use environment variable with fallback

// Middleware
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRoute);
app.use("/api/tables", tableRoute); 
app.use('/api/feedback', feedbackRoutes);
  

// app.use("/api/tables/reservations/:id", tableRoute);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
