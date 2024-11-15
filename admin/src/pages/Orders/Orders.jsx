// admin/src/pages/Orders/Orders.jsx
import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const ordersPerPage = 3;

    const fetchAllOrders = async () => {
        try {
            const response = await axios.get(`${url}/api/order/list`);
            if (response.data.success) {
                setOrders(response.data.data.reverse());
                console.log("Fetched Orders:", response.data.data);
            } else {
                toast.error("Error fetching orders");
            }
        } catch (error) {
            toast.error("Network error: " + error.message);
        }
    };

    const statusHandler = async (event, orderId) => {
        try {
            const response = await axios.post(`${url}/api/order/status`, {
                orderId,
                status: event.target.value,
            });
            if (response.data.success) {
                await fetchAllOrders();
            }
        } catch (error) {
            toast.error("Error updating order status: " + error.message);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [fromDate, toDate, orders]);

    const filterOrders = () => {
        if (!fromDate && !toDate) {
            setFilteredOrders(orders);
            return;
        }

        const filtered = orders.filter((order) => {
            const orderDate = new Date(order.date).setHours(0, 0, 0, 0);
            const from = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : new Date(0);
            const to = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : new Date();
            return orderDate >= from && orderDate <= to;
        });

        setFilteredOrders(filtered);
        console.log("Filtered Orders:", filtered);
        setCurrentPage(1);
    };

    const generateReport = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredOrders.map(order => ({
            'Order ID': order._id,
            'Customer Name': `${order.address.firstName} ${order.address.lastName}`,
            'Address': `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.zipcode}`,
            'Phone': order.address.phone,
            'Items': order.items.map(item => `${item.name} x ${item.quantity}`).join(', '),
            'Total Amount': `${currency}${order.amount}`,
            'Status': order.status,
            'Date': new Date(order.date).toLocaleString()
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        saveAs(data, `Orders_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    // Pagination logic
    const totalOrders = filteredOrders.length;
    const totalPages = Math.ceil(totalOrders / ordersPerPage);
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    // Change page
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className='order add'>
            <h1>Order Page</h1>
            <div className="order-list">
                {currentOrders.map((order) => (
                    <div key={order._id} className='order-item'>
                        <img src={assets.parcel_icon} alt="" />
                        <div>
                            <p className='order-item-food'>
                                {order.items.map((item, index) => (
                                    index === order.items.length - 1
                                        ? `${item.name} x ${item.quantity}`
                                        : `${item.name} x ${item.quantity}, `
                                ))}
                            </p>
                            <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
                            <div className='order-item-address'>
                                <p>{order.address.street + ","}</p>
                                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                            </div>
                            <p className='order-item-phone'>{order.address.phone}</p>
                        </div>
                        <p>Items : {order.items.length}</p>
                        <p>{currency}{order.amount}</p>
                        <select onChange={(e) => statusHandler(e, order._id)} value={order.status}>
                            <option value="Food Processing">Food Processing</option>
                            <option value="Out for delivery">Out for delivery</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                ))}
            </div>

            {/* Pagination controls */}
            <div className="pagination">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className={currentPage === 1 ? 'disabled button-size' : 'button-size'}
                >
                    Previous
                </button>

                {currentPage > 2 && (
                    <>
                        <button onClick={() => handlePageChange(1)} className='button-size'>1</button>
                        {currentPage > 3 && <span>...</span>}
                    </>
                )}

                {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;
                    if (pageNumber === currentPage - 1 || pageNumber === currentPage + 1 || pageNumber === currentPage) {
                        return (
                            <button 
                                key={pageNumber} 
                                onClick={() => handlePageChange(pageNumber)} 
                                className={currentPage === pageNumber ? 'active button-size' : 'button-size'}
                            >
                                {pageNumber}
                            </button>
                        );
                    }
                    return null; 
                })}

                {currentPage < totalPages - 1 && (
                    <>
                        {currentPage < totalPages - 2 && <span>...</span>}
                        <button onClick={() => handlePageChange(totalPages)} className='button-size'>{totalPages}</button>
                    </>
                )}

                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? 'disabled button-size' : 'button-size'}
                >
                    Next
                </button>
            </div>

            {/* Filter controls and report generation */}
            <div className="filter-controls">
                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    placeholder="From Date"
                />
                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    placeholder="To Date"
                />
                <button onClick={generateReport} className="generate-report">Generate Report</button>
            </div>
        </div>
    );
};

export default Order;
