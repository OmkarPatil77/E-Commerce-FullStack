import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/axiosInstance";

const Home = () => {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products/get");
        const products = res.data.data || [];

        // Group products by category
        const grouped = products.reduce((acc, product) => {
          const cat = product.category || "Others";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(product);
          return acc;
        }, {});

        console.log("Grouped products:", grouped);

        setProductsByCategory(grouped);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

   const images = [
    "https://ik.imagekit.io/nifjlz5x5/E-commerce/Screenshot%202025-08-15%20021759.png?updatedAt=1755204557623",
    "https://ik.imagekit.io/nifjlz5x5/E-commerce/Screenshot%202025-08-15%20021747.png?updatedAt=1755204557485",
    "https://ik.imagekit.io/nifjlz5x5/E-commerce/Screenshot%202025-08-15%20021734.png?updatedAt=1755204557389",
    "https://ik.imagekit.io/nifjlz5x5/E-commerce/Screenshot%202025-08-15%20021812.png?updatedAt=1755204557411",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3 seconds

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
   <main className="bg-gray-50 min-h-screen">
  {/* Deals Banner */}
  <section className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white p-6 text-center font-bold text-lg sm:text-2xl rounded-b-xl shadow-md">
    🔥 Hot Deals on Electronics & More! Shop Now & Save Big! 🔥
     <div className="w-full h-full mt-2 rounded-xl shadow-lg">
      <img
        src={images[currentIndex]}
        alt={`Banner ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
      />
    </div>
  </section>

  {/* Product Listings grouped by category */}
  <section className="max-w-7xl mx-auto px-4 py-12">
    {loading ? (
      <p className="text-center text-gray-700 text-lg">Loading products...</p>
    ) : Object.keys(productsByCategory).length === 0 ? (
      <p className="text-center text-gray-700 text-lg">No products available.</p>
    ) : (
      Object.entries(productsByCategory).map(([category, products]) => (
        <div key={category} className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 border-b-2 border-gray-300 pb-2 text-gray-800">
            {category}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/view-product/${product._id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 group overflow-hidden"
              >
                <div className="overflow-hidden">
                  <img
                    src={product.images[0]?.url || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="w-full h-52 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 truncate">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mt-1 truncate">{product.description}</p>
                  <p className="text-indigo-600 font-bold mt-2 text-lg">₹{product.price}</p>
                  <p className="text-sm text-gray-400 mt-1">Stock: {product.stock}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))
    )}
  </section>
</main>

  );
};

export default Home;
