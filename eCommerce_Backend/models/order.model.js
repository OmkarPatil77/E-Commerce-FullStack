import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        total: {
            type: Number,
            required: true
        },
        paymentInfo: {
            method: {
                type: String,
                enum: ["COD", "CARD", "UPI"],default: "COD"
            },
            status: {
                 type: String,
                 enum: ["Pending", "Paid", "Failed"],
                 default: "Pending"
            }
        },
         shippingAddress: {
            street: String,
            city: String,
            state: String,
            pincode: String,
            country: String
        },
        status: {
            type: String,
            enum: ["Processing", "Shipped", "Delivered"],
            default: "Processing"
        }
},{timestamps:true});

const Order = mongoose.model("Order",orderSchema);

export default Order;