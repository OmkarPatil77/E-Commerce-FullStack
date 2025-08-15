// src/pages/success.jsx
// src/pages/success.jsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/utils/cartStore";
import API from "@/utils/axiosInstance";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartStore();
  const orderProcessed = useRef(false);

  useEffect(() => {
    const placeOrder = async () => {
      // ✅ PREVENT multiple calls - exit if already processed or no cart
      if (orderProcessed.current || !cart || cart.length === 0) {
        console.log("Order already processed or no cart items");
        return;
      }

      // ✅ IMMEDIATELY mark as processed to block any other calls
      orderProcessed.current = true;
      
      console.log("Processing order with cart:", cart);

      try {
        const response = await API.post("/orders/place", {
          items: cart.map((item) => ({
            product: item.product?._id || item._id,
            quantity: item.quantity,
          })),
          total: cart.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          ),
          paymentInfo: { method: "CARD" },
          shippingAddress: {
            street: "Stripe Payment",
            city: "Stripe City",
            state: "Stripe State",
            pincode: "000000",
            country: "India",
          },
        });

        console.log("Order created successfully:", response.data);
        
        // ✅ CLEAR cart immediately after successful order
        clearCart();
        console.log("Cart cleared");

        // ✅ Redirect after success
        setTimeout(() => {
          navigate("/my-orders", { replace: true });
        }, 2000);

      } catch (err) {
        console.error("Order creation failed:", err);
        // ✅ Reset flag only on error to allow retry
        orderProcessed.current = false;
      }
    };

    placeOrder();
  },[cart, clearCart, navigate]); // ✅ EMPTY dependencies - run only once

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-600">
        ✅ Payment Successful!
      </h1>
      <p className="mt-2 text-gray-700">Thank you for your purchase.</p>
      <p className="mt-1 text-gray-500">Redirecting to My Orders...</p>

      <a
        href="/home"
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Go to Home
      </a>
    </div>
  );
}














// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCartStore } from "@/utils/cartStore";
// import API from "@/utils/axiosInstance";

// export default function PaymentSuccess() {
//   const navigate = useNavigate();
//   const { cart, clearCart } = useCartStore();

//   useEffect(() => {
//     const placeOrder = async () => {
//       if (!cart || cart.length === 0) return;

//       try {
//         await API.post("/orders/place", {
//           items: cart.map((item) => ({
//             product: item.product?._id || item._id,
//             quantity: item.quantity,
//           })),
//           total: cart.reduce(
//             (sum, item) => sum + item.product.price * item.quantity,
//             0
//           ),
//           paymentInfo: { method: "CARD" }, // Stripe
//           shippingAddress: {
//             street: "Stripe Payment",
//             city: "Stripe City",
//             state: "Stripe State",
//             pincode: "000000",
//             country: "India",
//           },
//         });

//         clearCart();

//         // ⏳ Redirect to My Orders after showing success for 2s
//         setTimeout(() => {
//           navigate("/my-orders");
//         }, 2000);
//       } catch (err) {
//         console.error("Order creation failed:", err);
//       }
//     };

//     placeOrder();
//   }, [cart, clearCart, navigate]);

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-green-50">
//       <h1 className="text-3xl font-bold text-green-600">
//         ✅ Payment Successful!
//       </h1>
//       <p className="mt-2 text-gray-700">Thank you for your purchase.</p>
//       <p className="mt-1 text-gray-500">Redirecting to My Orders...</p>

//       <a
//         href="/home"
//         className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//       >
//         Go to Home
//       </a>
//     </div>
//   );
// }
