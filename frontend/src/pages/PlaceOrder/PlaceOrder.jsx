import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {
    const [payment, setPayment] = useState("cod")
    
    const { 
        getTotalCartAmount, 
        token, 
        food_list, 
        cartItems, 
        url, 
        setCartItems,
        currency,
        hasTableReservation,
        tableReservationDetails,
        tableFee
    } = useContext(StoreContext);

    const navigate = useNavigate();

    const placeOrder = async (e) => {
        e.preventDefault()
        
        let orderItems = [];
        food_list.map(((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo)
            }
        }))
        
        // Check if there are items in the cart
        if (orderItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        // Basic user info from table reservation
        const userInfo = {
            firstName: tableReservationDetails?.name?.split(' ')[0] || '',
            lastName: tableReservationDetails?.name?.split(' ')[1] || '',
            phone: tableReservationDetails?.phone || ''
        };
        
        let orderData = {
            userId: token,
            address: userInfo,
            items: orderItems,
            amount: getTotalCartAmount(),
            isDineIn: true,
            tableReservation: tableReservationDetails
        }
        
        if (payment === "stripe") {
            try {
                toast.info("Processing payment...");
                let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
                
                if (response.data.success && response.data.session_url) {
                    toast.success("Redirecting to payment gateway...");
                    window.location.replace(response.data.session_url);
                } else {
                    toast.error(response.data.message || "Payment processing failed. Please try cash on delivery.");
                    setPayment("cod");
                }
            } catch (error) {
                console.error("Payment error:", error);
                const errorMessage = error.response?.data?.message || 
                                    error.response?.data?.error || 
                                    "Payment processing failed. Please try cash on delivery.";
                toast.error(errorMessage);
                setPayment("cod");
            }
        }
        else {
            try {
                toast.info("Placing order...");
                let response = await axios.post(url + "/api/order/placecod", orderData, { headers: { token } });
                
                if (response.data.success) {
                    toast.success("Order placed successfully!");
                    navigate("/myorders");
                    setCartItems({});
                }
                else {
                    toast.error(response.data.message || "Something went wrong. Please try again.");
                }
            } catch (error) {
                console.error("Order placement error:", error);
                const errorMessage = error.response?.data?.message || 
                                    error.response?.data?.error || 
                                    "Failed to place order. Please try again.";
                toast.error(errorMessage);
            }
        }
    }

    useEffect(() => {
        if (!token) {
            toast.error("Please sign in first to place an order")
            navigate('/cart')
        }
        else if (getTotalCartAmount() === 0) {
            navigate('/cart')
        }
    }, [token])

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Table Reservation Details</p>
                <div className="reservation-details">
                    <h3>Your Table Information</h3>
                    <p><strong>Name:</strong> {tableReservationDetails?.name}</p>
                    <p><strong>Table Number:</strong> {tableReservationDetails?.tableNumber}</p>
                    <p><strong>Table Size:</strong> {tableReservationDetails?.numberOfPeople} persons</p>
                    <p><strong>Date:</strong> {tableReservationDetails?.date}</p>
                    <p><strong>Time:</strong> {tableReservationDetails?.time}</p>
                </div>
                <p className="note">Your order will be prepared for your reserved table.</p>
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>{currency}{getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Table Fee</p>
                            <p>{currency}{getTotalCartAmount() === 0 ? 0 : tableFee}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>{currency}{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + tableFee}</b>
                        </div>
                    </div>
                </div>
                <div className="payment">
                    <h2>Payment Method</h2>
                    <div 
                        className={`payment-option ${payment === "cod" ? "selected" : ""}`}
                        onClick={() => setPayment("cod")}
                    >
                        <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                        <p>COD ( Cash on delivery )</p>
                    </div>
                    <div 
                        className={`payment-option ${payment === "stripe" ? "selected" : ""}`}
                        onClick={() => setPayment("stripe")}
                    >
                        <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
                        <p>Stripe ( Credit / Debit )</p>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>
                    {payment === "cod" ? "Place Order" : "Proceed To Payment"}
                </button>
            </div>
        </form>
    )
}

export default PlaceOrder
