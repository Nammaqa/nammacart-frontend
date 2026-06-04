import { createContext, useEffect, useState } from "react";
import axios from "axios";
// import { food_list } from "../../assets/assets";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = import.meta.env.VITE_API_URL;
  const [token, setToken] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [food_list, setFoodList] = useState([]);

  //remove food_list state

  // Clears expired / invalid token from state and localStorage
  const clearToken = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      try {
        const res = await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
        if (res.data?.tokenExpired) clearToken();
      } catch (error) {
        if (error.response?.status === 401) clearToken();
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      try {
        const res = await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );
        if (res.data?.tokenExpired) clearToken();
      } catch (error) {
        if (error.response?.status === 401) clearToken();
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    if (response.data.success) {
      setFoodList(response.data.data);
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data?.tokenExpired) {
        clearToken();
        return;
      }
      setCartItems(response.data.cartData || {});
    } catch (error) {
      if (error.response?.status === 401) {
        clearToken();
      }
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    searchTerm,
    setSearchTerm,
    clearToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
