import Order from "../models/order.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// Place Order - WITH DUPLICATE PREVENTION
export const placeOrder = async (req, res, next) => {
    try {
       const userId = req.user._id;
       const { items, total, paymentInfo, shippingAddress} = req.body;

       if(!items || items.length === 0) {
        throw new ApiError(400, "Order items are required");
       }

       // ✅ STRICT duplicate check - same user, same total, last 3 minutes
       const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
       const duplicateOrder = await Order.findOne({
         user: userId,
         total: total,
         createdAt: { $gte: threeMinutesAgo }
       }).sort({ createdAt: -1 });

       if (duplicateOrder) {
        //  console.log(`🚫 DUPLICATE ORDER BLOCKED: User ${userId}, Total ${total}, Existing Order: ${duplicateOrder._id}`);
         return res.status(200).json(new ApiResponse(200, duplicateOrder, "Order already placed"));
       }

       // ✅ CREATE new order
       const order = await Order.create({
        user: userId,
        items,
        total,
        paymentInfo,
        shippingAddress
       });

    //    console.log(`✅ NEW ORDER CREATED: ${order._id} for User ${userId}, Total: ${total}`);
       res.status(201).json(new ApiResponse(201, order, "Order placed successfully"));
       
    } catch (error) {
        // console.error("Order creation error:", error);
        next(error);
    }
};

// Get logged-in user's orders
export const getMyOrders = async (req,res,next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate("items.product");

         res.status(200).json(new ApiResponse(200, orders));
    } catch (error) {
        next(error);
    }
}

// Admin: Get all Orders
export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate("user", "name email").populate("items.product");

        res.status(200).json(new ApiResponse(200, orders));
    } catch (error) {
        next(error)
    }
}

// Admin: Update order status
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);
        if(!order) throw new ApiError(404, "Order not found");

        order.status = status;
        await order.save();

        res.status(200).json(new ApiResponse(200, order, "Order status updated"));
    } catch (error) {
        next(error);
    }
}