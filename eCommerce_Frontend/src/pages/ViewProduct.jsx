import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "@/utils/axiosInstance";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

export default function ViewProduct() {
  const { id } = useParams(); // get product id from URL
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
   const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [role, setRole] = useState(""); // NEW: role state

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/get/${id}`);
        setProduct(res.data.data); // according to your ApiResponse structure
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch reviews for product
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const res = await API.get(`/products/${id}/getreviews`);
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

   // Fetch logged-in user's role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data } = await API.get("/auth/profile");
        setRole(data.data.role);
      } catch (err) {
        console.error("Failed to fetch user role", err);
      }
    };
    fetchUserRole();
  }, []);

const handleAddToCart = async () => {
  try {
    await API.post("/cart/add", {
      productId: product._id,
      quantity,
    });
    alert("Product added to cart!");
  } catch (error) {
    console.error("Add to cart error:", error);
    alert(error.response?.data?.message || "Failed to add to cart");
  }
};


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return <p className="text-center mt-10">No product found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Image */}
        <img
          src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
          alt={product.name}
          className="w-full md:w-1/2 rounded-lg object-cover"
        />

        {/* Product Details */}
        <div className="flex flex-col justify-start space-y-4">
          <h1 className="text-3xl font-semibold">Name: {product.name}</h1>
          <p className="text-gray-700">Description: {product.description}</p>

          <p className="text-xl font-bold">Price: ₹{product.price}</p>

          <p>
            <span className="font-semibold">Category:</span> {product.category}
          </p>

          <p>
            <span className="font-semibold">Stock:</span>{" "}
            {product.stock > 0 ? product.stock : "Out of stock"}
          </p>

          <div className="flex items-center gap-2">
             <input
             type="number"
             min="1"
             max={product.stock}
             value={quantity}
             onChange={(e) => setQuantity(Number(e.target.value))}
             className="w-16 border rounded px-2 py-1"
             />
            <Button onClick={handleAddToCart}>
            Add To-cart
          </Button>
          {/* Only admin sees this */}
            {role === "ADMIN" && (
              <Link to={`/action-product/${product._id}`}>
                <Button className="bg-red-700">Update-Details</Button>
              </Link>
            )}
          </div>
           <Link
           to={`/add-review/${product._id}`}
          >
            <Button>
                Add-Review
            </Button>
          </Link>
        </div>
      </div>
       {/* Reviews Section */}
      <div>
        <h2 className="text-2xl font-semibold border-b pb-2">Customer Reviews</h2>

        {reviewsLoading ? (
          <p className="text-gray-500 mt-4">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 mt-4">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4 mt-4">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg shadow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">
                    {review.user?.username || "Anonymous"}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        color={i < review.rating ? "#ffc107" : "#e4e5e9"}
                        fill={i < review.rating ? "#ffc107" : "none"}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
