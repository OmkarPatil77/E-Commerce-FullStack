// src/pages/AddReview.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance"; // your JWT-configured axios
import { Star } from "lucide-react";

const AddReview = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !comment.trim()) {
      alert("Please provide both rating and comment!");
      return;
    }

    try {
      await axiosInstance.post(`/products/${productId}/addreview`, {
        rating,
        comment,
      });

      alert("Review submitted successfully!");
      navigate(`/view-product/${productId}`); // Redirect to product details page
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4">Add Your Review</h2>

      {/* Star Rating */}
      <div className="flex space-x-2 mb-4">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <label key={index}>
              <input
                type="radio"
                name="rating"
                value={starValue}
                onClick={() => setRating(starValue)}
                className="hidden"
              />
              <Star
                size={30}
                className="cursor-pointer"
                color={
                  starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                }
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(null)}
              />
            </label>
          );
        })}
      </div>

      {/* Comment Box */}
      <textarea
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        rows="4"
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200"
      >
        Submit Review
      </button>
    </div>
  );
};

export default AddReview;
