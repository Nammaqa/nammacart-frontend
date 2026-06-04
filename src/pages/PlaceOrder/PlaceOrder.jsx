import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../components/context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url, clearToken } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }
  const [paymentStep, setPaymentStep] = useState(0) // 0 = initial, 1 = show COD, 2 = confirm place order

  const placeOrder = async () => {
    let orderItems = [];
    food_list.map((item, index) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    })
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    }

    try {
      let response = await axios.post(url + '/api/order/place', orderData, { headers: { token } })

      if (response.data.success) {
        // Backend places Cash on Delivery orders and returns orderId
        alert(response.data.message || 'Order placed successfully')
        navigate('/myorders')
      } else {
        alert(response.data.message || 'Error placing order')
      }
    } catch (err) {
      console.error('Place order error:', err.message || err)
      if (err.response?.status === 401) {
        clearToken();
        navigate('/');
        alert('Session expired. Please log in again.');
      } else {
        alert(err.response?.data?.message || 'Error placing order. Please try again.')
      }
    }
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/cart')
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart')
    }
  }, [token])

  const handleProceed = (e) => {
    e.preventDefault()
    setPaymentStep(1)
  }

  const handleSelectCOD = () => {
    setPaymentStep(2)
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>
      <div className="place-order-left">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-detail">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-detail">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-detail">
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          {paymentStep === 0 && (
            <button type='button' onClick={handleProceed}>PROCEED TO CHECKOUT</button>
          )}
          {paymentStep === 1 && (
            <button type='button' onClick={handleSelectCOD}>Cash on Delivery</button>
          )}
          {paymentStep === 2 && (
            <button type='button' onClick={placeOrder}>Cash on Delivery</button>
          )}
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder