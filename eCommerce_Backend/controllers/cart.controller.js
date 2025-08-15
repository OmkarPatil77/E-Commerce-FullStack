import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// Add Product to cart
export const addToCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        if(!productId || !quantity) {
            throw new ApiError(400, "Product ID and quantity are required");
        }

        const product = await Product.findById(productId);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }
        
        if (product.stock < quantity) {
            throw new ApiError(400, "Insufficient stock");
        }

        let cart = await Cart.findOne({
            user: userId
        });

        if(!cart) {
            cart = await Cart.create({
                user: userId,
                items: [{ product: productId, quantity}]
            });
        } else {
            const existingItem = cart.items.find(item => item.product.toString() === productId);
        
            if(existingItem) {
                if(product.stock < existingItem.quantity + quantity) {
                    throw new ApiError(400, "Insufficient stock to increase quantity");
                }
                existingItem.quantity += quantity;
            }
            else {
                cart.items.push({ product:productId, quantity});
            }
            await cart.save();
        }
        res.status(200).json(new ApiResponse(200, cart, "Product added to cart"));
    } catch (error) {
        next(error);
    }
};

// Get user cart
export const getCart = async(req, res, next) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId}).populate("items.product");

        if(!cart) {
            return res.status(200).json( new ApiResponse(200, [], "Cart is empty"));
        }

        res.status(200).json(new ApiResponse(200, cart, "Cart retrieved"));
    } catch (error) {
        next(error);
    }
};

// Update quantity
export const updateCartItem = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            throw new ApiError(400, "Product ID and quantity are required");
        }

        const product = await Product.findById(productId);
        if (!product) throw new ApiError(404, "Product not found");

        if (product.stock < quantity) {
            throw new ApiError(400, "Insufficient product stock");
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) throw new ApiError(404, "Cart not found");

        const item = cart.items.find(item => item.product.toString() === productId);
        if (!item) throw new ApiError(404, "Item not found in cart");

        item.quantity = quantity;
        await cart.save();

        res.status(200).json(new ApiResponse(200, cart, "Cart item updated"));
    } catch (error) {
        next(error);
    }
};


// Remove Item
export const removeCartItem = async(req, res, next) => {
    try {
        const userId = req.user._id;
        const {itemId} = req.params;

        const cart = await Cart.findOne({ user: userId});
        if(!cart) throw new ApiError(404, "Card not found");

        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        await cart.save();
        
        res.status(200).json(new ApiResponse(200, cart, "Item removed from cart"));
    } catch (error) {
        next(error);
    }
}

export const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ user: req.user.id });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
};
