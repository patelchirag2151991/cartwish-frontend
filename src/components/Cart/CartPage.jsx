import React, { useEffect, useState, useContext, memo, useMemo } from "react";

import UserContext from "../../contexts/UserContext";
import "./CartPage.css";
import config from "../../config.json";
import remove from "../../assets/remove.png";
import Table from "../Common/Table";
import QuantityInput from "../SingleProduct/QuantityInput";
import cartContext from "../../contexts/CartContext";
import { addToCartAPI } from "./../../services/cartServices";
import { checkoutAPI } from "../../services/orderServices";
import { toast } from "react-toastify";

const CartPage = () => {
  // console.log(cart);

  // const [subtotal, setSubtotal] = useState(0);

  const user = useContext(UserContext);
  const { cart, removeFromCart, updateCart, setCart } = useContext(cartContext);
  // console.log(user);

  const subtotal = useMemo(() => {
    let total = 0;

    cart.map((item) => {
      total += item.product.price * item.quantity;
    });
    // setSubtotal(total);
    return total;
  }, [cart]);

  const checkout = () => {
    const oldCart = [...cart];
    setCart([]);
    checkoutAPI()
      .then((res) => {
        toast.success("Order placed successfully!");
      })
      .catch((err) => {
        toast.error("Something went wrong!");
        setCart(oldCart);
      });
  };
  return (
    <section className="align_center cart_page">
      <div className="align_center user_info">
        <img
          src={`${config.backendURL}/profile/${user?.profilePic}`}
          alt="user profile"
        />
        <div>
          <p className="user_name">Name: {user?.name}</p>
          <p className="user_email">Email: {user?.email}</p>
        </div>
      </div>

      {/* Cart Table */}
      <Table headings={["Item", "Price", "Quantity", "Total", "Remove"]}>
        <tbody>
          {cart.map(({ product, quantity }) => (
            <tr key={product._id}>
              <td>{product.title}</td>
              <td>${product.price.toFixed(2)}</td>
              <td className="align_center table_quantity_input">
                <QuantityInput
                  quantity={quantity}
                  setQuantity={updateCart}
                  stock={product.stock}
                  cartPage={true}
                  productId={product._id}
                />
              </td>
              <td>{(product.price * quantity).toFixed(2)}</td>
              <td>
                <img
                  src={remove}
                  alt="remove icon"
                  className="cart_remove_icon"
                  onClick={() => removeFromCart(product._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <table className="cart_bill">
        <tbody>
          <tr>
            <td>Subtotal</td>
            <td>${subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Shipping Charge</td>
            <td>${5}</td>
          </tr>
          <tr className="cart_bill_final">
            <td>Total</td>
            <td>${(subtotal + 5).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <button className="search_button checkout_button" onClick={checkout}>
        Checkout
      </button>
    </section>
  );
};

export default memo(CartPage);
