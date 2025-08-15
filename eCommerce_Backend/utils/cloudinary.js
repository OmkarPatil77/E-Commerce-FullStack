import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
dotenv.config();
import fs from "fs"

// Make sure to configure cloudinary before using
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "missing",
    api_key:    process.env.CLOUDINARY_API_KEY || "missing",
    api_secret: process.env.CLOUDINARY_API_SECRET || "missing",
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null; //Prevents errors when undefined or null is passed.
       
        const response = await cloudinary.uploader.upload(localFilePath, {resource_type: "auto" 
             //upload the file on cloudinary
            // resource_type: "auto" allows both images, videos, etc.
        })

        fs.unlinkSync(localFilePath) //Once the upload is successful, it deletes the local file using fs.unlinkSync.

        return response;

    } catch(error){
        
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export {uploadOnCloudinary}


// Below is Meaning of above code block

/*
> It takes a file path of an uploaded file (usually via Multer).
> Uploads that file to Cloudinary (an online media storage service).
> Deletes the local copy of the file after uploading.
> Returns the response from Cloudinary (which contains the url and other metadata).
> If anything fails, it tries to delete the local file and returns null.
*/