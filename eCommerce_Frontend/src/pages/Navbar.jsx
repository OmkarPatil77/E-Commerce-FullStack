import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/utils/cartStore";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "@/utils/axiosInstance";

export default function Navbar() {
  const { cart, fetchCart } = useCartStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products/get");
        setAllProducts(res.data.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.trim() === "") {
      navigate("/");
      return;
    }

    const filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );

    navigate("/search", { state: { results: filtered, query } });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 cursor-pointer">
          <Link to="/">Storeblitz</Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden sm:flex flex-1 mx-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search for products..."
            className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-6 text-gray-700 text-xl cursor-pointer">
          <Link to="/cart" className="relative flex items-center">
            <ShoppingCart className="w-6 h-6 hover:text-blue-500 transition-colors duration-200" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/my-orders"
            className="text-base hover:text-blue-500 transition-colors"
          >
            My Orders
          </Link>
          <Link to="/view-profile">
            <User className="hover:text-blue-500 transition-colors duration-200" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="sm:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-3 bg-white shadow-md">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search for products..."
            className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <div className="flex flex-col gap-3 mt-2">
            <Link
              to="/cart"
              className="flex items-center justify-between text-gray-700 hover:text-blue-500 transition-colors"
            >
              Cart
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/my-orders"
              className="text-gray-700 hover:text-blue-500 transition-colors"
            >
              My Orders
            </Link>
            <Link
              to="/view-profile"
              className="text-gray-700 hover:text-blue-500 transition-colors"
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
