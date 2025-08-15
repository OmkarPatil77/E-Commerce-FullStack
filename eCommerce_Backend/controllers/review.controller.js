import Product from "../models/product.model.js";

// Add a new review
export const addReview = async (req, res) => {
    
  // console.log(req.body);
  const { rating, comment } = req.body;
  const {productId} = req.params;
  const userId = req.user._id;
  // console.log("User:", req.user);

  // console.log(productId)
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === userId.toString()
  );

  if (alreadyReviewed) {
    alreadyReviewed.rating = rating;
    alreadyReviewed.comment = comment;
  } else {
    product.reviews.push({ user: userId, rating, comment });
  }

  await product.save();
  res.status(200).json({ message: "Review added/updated" });
};

// Get all reviews of a product
export const getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId).populate({
      path: "reviews.user",
      select: "username",
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product.reviews);
  } catch (err) {
    next(err);
  }
};

// Delete a review
export const deleteReview = async (req, res, next) => {
  const productId = req.params.id;
  const userId = req.user._id;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const initialCount = product.reviews.length;

  product.reviews = product.reviews.filter(
    (review) => review.user.toString() !== userId.toString()
  );

  if (product.reviews.length === initialCount) {
    return res.status(404).json({ message: "Review not found or unauthorized" });
  }

  await product.save();
  res.status(200).json({ message: "Review deleted" });
};

