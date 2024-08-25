import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import UserContext from "./contexts/UserContext";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Routing from "./components/Routing/Routing";
import { getJwt, getUser } from "./services/userServices";
import setAuthToken from "./utils/setAuthToken";
import {
  addToCartAPI,
  decreaseProductAPI,
  getCartAPI,
  increaseProductAPI,
  removeFromCartAPI,
} from "./services/cartServices";
import "react-toastify/dist/ReactToastify.css";
import cartContext from "./contexts/CartContext";

setAuthToken(getJwt());

const App = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const jwtUser = getUser();
      // console.log(jwtUser);
      if (Date.now() >= jwtUser.exp * 1000) {
        localStorage.removeItem("token");
        location.reload();
      } else {
        setUser(jwtUser);
      }
    } catch (error) {}
  }, []);

  const addToCart = useCallback(
    (product, quantity) => {
      const updatedCart = [...cart];
      const productIndex = updatedCart.findIndex(
        (item) => item.product_id === product._id
      );

      if (productIndex === -1) {
        updatedCart.push({ product: product, quantity: quantity });
      } else {
        updatedCart[productIndex].quantity += quantity;
      }

      setCart(updatedCart);

      addToCartAPI(product._id, quantity)
        .then((res) => {
          // console.log(res.data);
          toast.success("Product Added Successfully!");
          // toast.error("Product Added Successfully!");
          // toast.warning("Product Added Successfully!");
          // toast.info("Product Added Successfully!");
          // toast("Product Added Successfully!");
        })
        .catch((err) => {
          // console.log(err.response);
          toast.error("Failed to add product!");
          setCart(cart);
        });
    },
    [cart]
  );

  const removeFromCart = useCallback(
    (id) => {
      const oldCart = [...cart];
      const newCart = cart.filter((item) => item.product._id !== id);
      setCart(newCart);
      removeFromCartAPI(id).catch((err) => {
        toast.error("Something went wrong!");
        setCart(oldCart);
      });
    },
    [cart]
  );

  const updateCart = useCallback(
    (type, id) => {
      const oldCart = [...cart];
      const updatedCart = [...cart];
      const productIndex = updatedCart.findIndex(
        (item) => item.product._id === id
      );

      if (type === "increase") {
        updatedCart[productIndex].quantity += 1;
        setCart(updatedCart);

        increaseProductAPI(id).catch((err) => {
          toast.error("Something went wrong!");
          setCart(oldCart);
        });
      }
      if (type === "decrease") {
        updatedCart[productIndex].quantity -= 1;
        setCart(updatedCart);

        decreaseProductAPI(id).catch((err) => {
          toast.error("Something went wrong!");
          setCart(oldCart);
        });
      }
    },
    [cart]
  );

  const getCart = useCallback(() => {
    getCartAPI()
      .then((res) => {
        setCart(res.data);
      })
      .catch((err) => {
        toast.error("Something went wrong!!");
      });
  }, [user]);

  useEffect(() => {
    if (user) getCart();
  }, [user]);

  return (
    <UserContext.Provider value={user}>
      <cartContext.Provider
        value={{
          cart: cart,
          addToCart: addToCart,
          removeFromCart: removeFromCart,
          updateCart: updateCart,
          setCart: setCart,
        }}
      >
        <div className="app">
          <Navbar />

          <main>
            <ToastContainer position="bottom-right" />
            <Routing />
          </main>
        </div>
      </cartContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
