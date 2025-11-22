import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
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
      navigate(`/view-product/${productId}`);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6">

        <h2 className="text-2xl font-semibold text-center mb-4">
          Add Your Review
        </h2>

        {/* Star Rating */}
        <div className="flex justify-center space-x-2 mb-4">
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
                  size={35}
                  className="cursor-pointer transition-transform duration-150"
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

        {/* Textarea */}
        <textarea
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          rows="4"
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200"
        >
          Submit Review
        </button>

      </div>
    </div>
  );
};

export default AddReview;
