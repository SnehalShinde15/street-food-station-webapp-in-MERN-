import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  
  const [data, setData] = useState([]);
  const {url, token, currency} = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(url+"/api/order/userorders", {}, {headers:{token}});
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token])

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className="order-item">
            <div className="order-header">
              <h3>Order #{index + 1}</h3>
              <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
            </div>
            <div className="order-details">
              <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
              <p><strong>Amount:</strong> ₹{order.amount}</p>
              {order.isDineIn && order.tableReservation && (
                <div className="table-details">
                  <p><strong>Table Number:</strong> {order.tableReservation.tableNumber}</p>
                  <p><strong>Table Size:</strong> {order.tableReservation.tableSize} persons</p>
                  <p><strong>Reservation Time:</strong> {order.tableReservation.time}</p>
                  <p><strong>Reservation Date:</strong> {new Date(order.tableReservation.date).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            <div className="order-items">
              <h4>Items:</h4>
              {order.items.map((item, itemIndex) => (
                <div key={itemIndex} className="order-item-detail">
                  <span>{item.name}</span>
                  <span>x{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrders
