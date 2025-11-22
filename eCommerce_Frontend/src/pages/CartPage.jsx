import { useEffect } from "react";
import { useCartStore } from "@/utils/cartStore";
// import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import API from "@/utils/axiosInstance";
import { Trash2 } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function CartPage() {
  const { cart, fetchCart, removeFromCart, loading, error } = useCartStore();
  // const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // const goToCheckout = () => {
  //   navigate("/checkout", { state: { cartItems: cart, cartTotal } });
  // };

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    try {
      const res = await API.post("/payment/create-checkout-session", {
        cartItems: cart,
      });

      const { id } = res.data;
      await stripe.redirectToCheckout({ sessionId: id });
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
   <div className="min-h-screen w-full flex justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow-md">

        <h1 className="text-xl text-center font-bold mb-4">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-center text-red-600">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.product.price} × {item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-700">Qty: {item.quantity}</span>

                    <button
                      className="text-red-500 hover:scale-110 transition"
                      onClick={() => removeFromCart(item._id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₹{cartTotal}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-2 mt-4 rounded-lg hover:bg-green-700 transition"
            >
              Proceed to Checkout
            </button>
          </>
        )}

      </div>
    </div>
  );
}
