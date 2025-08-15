import { create } from "zustand";
import API from "../utils/axiosInstance"; // your JWT axios instance

export const useCartStore = create((set, get) => ({
  cart: [],
  loading: false,
  error: null,

  fetchCart: async () => {
    try {
      set({ loading: true, error: null });
      const res = await API.get("/cart");
      set({ cart: res.data.data.items || [], loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to fetch cart", loading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      await API.post("/cart/add", { productId, quantity });
      get().fetchCart(); // refresh cart after adding
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to add to cart" });
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      await API.put("/cart/update", { productId, quantity });
      get().fetchCart();
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to update quantity" });
    }
  },

  removeFromCart: async (itemId) => {
    try {
      await API.delete(`/cart/remove/${itemId}`);
      get().fetchCart();
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to remove item" });
    }
  },

  clearCart: async () => {
    try {
      await API.delete("/cart/clear"); // Backend endpoint to clear cart
      set({ cart: [] }); // Empty local state immediately
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to clear cart",
      });
    }
  },
}));



