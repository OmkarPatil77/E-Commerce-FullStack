import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "@/utils/axiosInstance";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/utils/cartStore";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();

  const cartItems = state?.cartItems || [];
  const cartTotal = state?.cartTotal || 0;

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validate form fields
  const validateForm = () => {
    let formErrors = {};
    Object.entries(shippingAddress).forEach(([key, value]) => {
      if (!value.trim()) {
        formErrors[key] = `${key} is required`;
      }
    });
    return formErrors;
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      const res = await API.post("/orders/place", {
        items: cartItems.map((item) => ({
          product: item.product?._id || item._id,
          quantity: item.quantity,
        })),
        total: cartTotal,
        paymentInfo: { method: paymentMethod },
        shippingAddress,
      });

      if (res.status === 200 || res.status === 201) {
        alert("Order placed successfully!");
        clearCart(); // ✅ Clears cart only after success
        navigate("/my-orders");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {/* Shipping Form */}
      <div className="space-y-3">
        {Object.keys(shippingAddress).map((field) => (
          <div key={field}>
            <input
              type="text"
              placeholder={field}
              value={shippingAddress[field]}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  [field]: e.target.value,
                })
              }
              className={`w-full border rounded px-3 py-2 ${
                errors[field] ? "border-red-500" : ""
              }`}
            />
            {errors[field] && (
              <p className="text-red-500 text-sm">{errors[field]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Payment Method */}
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      >
        <option value="COD">Cash on Delivery</option>
        <option value="CARD">Card</option>
        <option value="UPI">UPI</option>
      </select>

      <div className="font-bold text-lg flex justify-between border-t pt-4">
        <span>Total:</span>
        <span>₹{cartTotal}</span>
      </div>

      <Button className="w-full" onClick={placeOrder} disabled={loading}>
        {loading ? "Placing Order..." : "Place Order"}
      </Button>
    </div>
  );
}
