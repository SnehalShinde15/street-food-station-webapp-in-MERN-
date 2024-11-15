import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TableReservation.css';  // Ensure this path is correct
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TableReservation = ({ loggedInUserEmail }) => {  // Pass logged-in user email as a prop
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        numberOfPeople: 1,
        tableNumber: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the email matches the logged-in user's email
        // if (formData.email !== loggedInUserEmail) {
        //     toast.error("Email does not match the logged-in user.");
        //     return;
        // }

        try {
            const response = await axios.post('http://localhost:4000/api/tables/reserve', formData);
            toast.success(response.data.message);  // Use toast for success message
            setFormData({
                name: '',
                email: '',
                phone: '',
                date: '',
                time: '',
                numberOfPeople: 1,
                tableNumber: '',
            });
        } catch (error) {
            console.error('Error making reservation', error);
            const errorMsg = error.response?.data?.message || 'Error making reservation';
            toast.error(errorMsg);  // Display error message via toast
        }
    };

    return (
        <div className="reservation-form" id='table-book'>
            <ToastContainer />
            <h2>Book a Table</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
                <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                />
                {formData.numberOfPeople > 10 && (
                    <p className="error-message">Maximum 10 people allowed per reservation.</p>
                )}
                <input
                    type="number"
                    name="numberOfPeople"
                    placeholder="Number of People"
                    value={formData.numberOfPeople}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    required
                />
                <input
                    type="number"
                    name="tableNumber"
                    placeholder="Table Number (1-15)"
                    value={formData.tableNumber}
                    onChange={handleChange}
                    min="1"
                    max="15"  // Set max limit for table number
                    required
                />
                <button type="submit">Book Now</button>
            </form>
        </div>
    );
};

export default TableReservation;
