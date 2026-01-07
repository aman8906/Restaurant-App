import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export const AppContext = createContext();

// ✅ Axios config
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true; 

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState({ items: [] });
  const [totalPrice, setTotalPrice] = useState(0);

  // 🔹 Calculate total price
  useEffect(() => {
    if (cart?.items?.length > 0) {
      const total = cart.items.reduce(
        (sum, item) => sum + item.menuItem.price * item.quantity,
        0
      );
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [cart]);

  // 🔹 Cart count
  const cartCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  // 🔹 Fetch cart
  const fetchCartData = async () => {
    try {
      const { data } = await axios.get("/api/cart/get");
      if (data.success) setCart(data.cart);
    } catch (error) {
      console.log("Fetch cart error:", error);
    }
  };

  // 🔹 Add to cart
  const addToCart = async (menuId) => {
    try {
      const { data } = await axios.post("/api/cart/add", {
        menuId,
        quantity: 1,
      });

      if (data.success) {
        toast.success(data.message);
        fetchCartData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Add to cart error:", error);
      toast.error("Something went wrong!");
    }
  };

  // 🔹 Fetch categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/category/all");
      if (data.success) setCategories(data.categories);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  // 🔹 Fetch menus
  const fetchMenus = async () => {
    try {
      const { data } = await axios.get("/api/menu/all");
      if (data.success) setMenus(data.menuItems);
    } catch (error) {
      console.log("Error fetching menus:", error);
    }
  };

  // ✅ AUTH CHECK (FIXED AUTO LOGIN ISSUE)
  const isAuth = async () => {
    try {
      const tokenExists = document.cookie.includes("token");

      // 🚫 No token → don't auto login
      if (!tokenExists) {
        setUser(null);
        setAdmin(null);
        return;
      }

      const { data } = await axios.get("/api/auth/is-auth");

      if (data.success) {
        setUser(data.user);

        if (data.user.email === import.meta.env.VITE_ADMIN_EMAIL) {
          setAdmin(data.user);
        } else {
          setAdmin(null);
        }
      } else {
        setUser(null);
        setAdmin(null);
      }
    } catch (error) {
      setUser(null);
      setAdmin(null);
      console.log("Auth check failed:", error);
    }
  };

  // 🔹 Initial Load
  useEffect(() => {
    isAuth();
    fetchCategories();
    fetchMenus();
    fetchCartData();
  }, []);

  // ✅ Context value
  const value = {
    navigate,
    loading,
    setLoading,
    isAuth,
    user,
    setUser,
    admin,
    setAdmin,
    axios,
    categories,
    fetchCategories,
    menus,
    fetchMenus,
    cart,
    cartCount,
    totalPrice,
    fetchCartData,
    addToCart,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
