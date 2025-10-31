import React, { useContext, useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const navigate = useNavigate();

  useEffect(()=>{
    if(!token){
      navigate('/cart')
      alert("Please login ")
    }
    else if(getTotalCartAmount()===0){
      {
        navigate("/cart")
        alert("Please login")
      }
    }
  },[token])

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    if (getTotalCartAmount() === 0) {
      alert("Your cart is empty!");
      return;
    }

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({ ...item, quantity: cartItems[item._id] });
      }
    });

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });

      if (!response.data.success) {
        alert("Error in placing order: " + response.data.message);
        return;
      }

      const orderDbId = response.data.orderDbId;

      const options = {
        key: response.data.key,
        amount: response.data.amount,
        currency: response.data.currency,
        order_id: response.data.orderId,
        name: "Food Delivery",
        description: "Order Payment",
        handler: async function (paymentResponse) {
          try {
            const verifyResponse = await axios.post(
              `${url}/api/order/verify`,
              {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                orderDbId,
              },
              { headers: { token } }
            );

            if (verifyResponse.data.success) {
              window.location.href = `/Verify?success=true&orderDbId=${orderDbId}`;
            } else {
              await axios.post(`${url}/api/order/delete`, { orderDbId });
              window.location.href = `/Verify?success=false&orderDbId=${orderDbId}`;
            }
          } catch (error) {
            console.error("Verification error:", error);
            await axios.post(`${url}/api/order/delete`, { orderDbId });
            window.location.href = `/Verify?success=false&orderDbId=${orderDbId}`;
          }
        },

        // 🟡 This is important: handles user closing popup
        modal: {
          ondismiss: async function () {
            try {
              await axios.post(`${url}/api/order/delete`, { orderDbId });
            } catch (err) {
              console.error("Delete on dismiss failed:", err);
            }
            window.location.href = "/";
          },
        },

        prefill: {
          name: data.firstName + " " + (data.lastName || ""),
          email: data.email,
          contact: data.phone,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);

      // 🟥 payment failed event
      rzp.on("payment.failed", async function () {
        try {
          await axios.post(`${url}/api/order/delete`, { orderDbId });
        } catch (err) {
          console.error("Delete on payment.failed failed:", err);
        }
        window.location.href = "/";
      });

      rzp.open();
    } catch (error) {
      console.error("API Error:", error);
      alert("Network error: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <form onSubmit={placeOrder} className="place_order">
      <div className="place_order_left">
        <p className="title">Delivery Information</p>
        <div className="multi_fields">
          <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First name" />
          <input name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last name (Optional)" />
        </div>
        <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address" />
        <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" />
        <div className="multi_fields">
          <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
          <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
        </div>
        <div className="multi_fields">
          <input required name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip code" />
          <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
        </div>
        <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" />
      </div>

      <div className="place_order_right">
        <div className="cart_total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart_total_details">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart_total_details">
              <p>Delivery fee</p>
              <p>{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart_total_details">
              <b>Total</b>
              <b>{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
