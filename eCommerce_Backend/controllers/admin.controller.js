import { User } from "../models/user.model.js";
import Product from "../models/product.model.js";
// import { Order } from "../models/order.model.js"; // optional if you don’t have it

export const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    // ✅ Count reviews from all products
    const products = await Product.find({}, "reviews"); // get only the reviews field
    const totalReviews = products.reduce((acc, product) => acc + product.reviews.length, 0);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalReviews,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard stats",
      error: error.message,
    });
  }
};
