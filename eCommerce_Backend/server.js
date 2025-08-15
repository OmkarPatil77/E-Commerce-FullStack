import dotenv from "dotenv";
dotenv.config();

import cors from "cors"
import express from "express"
import connectDB from "./db/dbConnect.js"
import userRoutes from "./routes/auth.routes.js"
import productRoutes from "./routes/product.routes.js"
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import testRoutes from "./routes/test.routes.js"
import paymentRoutes from "./routes/payment.routes.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js"

const app = express()
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json());

// Sample Test Route
app.get("/", (req, res) => {
    res.send("API is runnning...");
})

// Test routes
app.use("/api/test",testRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);

// 404 Middleware
app.use(notFound);

// Error Handler Middleware
app.use(errorHandler);

// Starting The Server
connectDB()
.then( () => {
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
})
.catch((err) => {
        console.log("MongoDB Connection Failed", err);
    })


