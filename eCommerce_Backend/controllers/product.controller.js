import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

// Create Product - Admin Only
export const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, stock, category} = req.body;

        if (!name || !description || !price || !stock || !category) {
            throw new ApiError(400, "All fields are required");
        }

        // console.log(req.file);
        
        // Image upload logic
        const imageFile = req.file;


        if(!imageFile || imageFile.length === 0) {
            throw new ApiError(400, "Product image is required");
        }

        // Step 2: Upload images to Cloudinary
        const result = await uploadOnCloudinary(imageFile.path);
        
        if (!result) {
            throw new ApiError(500, "Image upload failed");
        }

        // Step 3: Format image data for MongoDB
        const images = ({
            public_id: result.public_id,
            url: result.secure_url,
        });

        // Step 4: Create product in DB
        const product = await Product.create({
            name,
            description,
            price,
            stock,
            category,
            images,
            createdBy: req.user._id,
        });

        res.status(201).json(new ApiResponse(201, product, "Product created Successfully"));

    } catch (error) {
        next(error);
    }
};

// Get All Products
export const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.status(200).json(new ApiResponse(200, products, "All products fetched"));
    } catch (error) {
        next(error);
    }
};

// Get Product by ID
export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if(!product) {
            throw new ApiError(404, "Product not found");
        }

        res.status(200).json(new ApiResponse(200, product, "Product found"));

    } catch (error) {
        next(error)
    }
};

// Update Product - Admin Only
export const updateProduct = async (req, res, next) => {
    try{
        const updates = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id, updates,
            {
            new: true,
            runValidators: true
        });
        if(!product) {
            throw new ApiError(404, "Product not found");
        }

        res.status(200).json(new ApiResponse(200, product, "Product updated"));

    } catch (error) {
        next(error);
    }
}

// Delete Product - Admin Only
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        res.status(200).json(new ApiResponse(200, product, "Product deleted"));

    } catch (error) {
        next(error);
    }
};