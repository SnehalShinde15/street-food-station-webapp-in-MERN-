
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Feedback.css';

const Feedback = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const feedbackPerPage = 5; // Adjust for desired number of feedback items per page

    useEffect(() => {
        fetchFeedback();
    }, []);

   
    const fetchFeedback = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/feedback');
            setFeedbackList(response.data);
 // Adjust the endpoint as per your server configuration
            if (response.data.success) {
                setFeedbackList(response.data.data);
                toast.success("Feedback data fetched successfully.");
            } else {
                toast.error("Failed to fetch feedback data.");
            }
        } catch (error) {
            console.error("Error fetching feedback:", error);
            toast.error("Error fetching feedback: " + error.message);
        }
        
    };

    const indexOfLastFeedback = currentPage * feedbackPerPage;
    const indexOfFirstFeedback = indexOfLastFeedback - feedbackPerPage;
    const currentFeedback = feedbackList.slice(indexOfFirstFeedback, indexOfLastFeedback);
    const totalPages = Math.ceil(feedbackList.length / feedbackPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="feedback-page">
            <h1>Customer Feedback</h1>

            <table className="feedback-table">
                <thead>
                    <tr>
                        <th>Feedback Text</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {currentFeedback.map((feedback) => (
                        <tr key={feedback._id}>
                            <td>{feedback.text}</td>
                            <td>{new Date(feedback.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="page-button"
                >
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={currentPage === index + 1 ? "active-page page-button" : "page-button"}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="page-button"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Feedback;
