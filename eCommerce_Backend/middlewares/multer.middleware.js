import multer from "multer"; // Multer handles file uploads
import { v2 } from "cloudinary";

// Step 1: Define how/where files are stored locally
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,"./public/temp") // Files will be saved in this directory
    },
    filename: function( req, file, cb) {
        cb(null, file.originalname) // Keeps the original filename
    }
})

// Step 2: Create multer upload middleware using the storage config
export const upload = multer({
    storage, // You can also add file size/type filters here if needed
})