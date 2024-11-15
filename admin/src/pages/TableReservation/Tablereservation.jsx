import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { utils, writeFile } from 'xlsx';
import 'react-datepicker/dist/react-datepicker.css';
import './Tablereservation.css';
import removeIcon from '../../assets/remove.png';


const TableReservation = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [reportGenerated, setReportGenerated] = useState(false); // New state for report generation
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/tables/reservations');
                setReservations(response.data);
            } catch (err) {
                setError('Error fetching reservations');
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    const handleDelete = async (_id) => {
        try {
            await axios.delete(`http://localhost:4000/api/tables/reservations/${_id}`);
            setReservations(reservations.filter(reservation => reservation._id !== _id));
            setFilteredReservations(filteredReservations.filter(reservation => reservation._id !== _id));
        } catch (err) {
            setError('Error deleting reservation');
        }
    };

    const handleFilter = () => {
        if (fromDate && toDate) {
            const filtered = reservations.filter(reservation => {
                const reservationDate = new Date(reservation.date);
                return reservationDate >= fromDate && reservationDate <= toDate;
            });
            setFilteredReservations(filtered);
            setCurrentPage(1);
        }
    };

    const generateExcelReport = () => {
        const dataToExport = filteredReservations.length > 0 ? filteredReservations : reservations;
        const ws = utils.json_to_sheet(dataToExport);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Reservations");
        writeFile(wb, "Reservations_Report.xlsx");
        setReportGenerated(true); // Set report generated state to true
    };

    const handleCancel = () => {
        setReportGenerated(false); // Reset the report generated state
        setFromDate(null); // Reset date pickers
        setToDate(null);
        setFilteredReservations([]); // Clear filtered reservations
        setCurrentPage(1); // Reset to the first page
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    const totalItems = filteredReservations.length > 0 ? filteredReservations.length : reservations.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = (filteredReservations.length > 0 ? filteredReservations : reservations).slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="table-reservation">
            <h1>Table Reservations</h1>

            {currentItems.length === 0 ? (
                <p>No reservations found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Number of People</th>
                            <th>Table Number</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((reservation) => (
                            <tr key={reservation.id}>
                                <td>{reservation.name}</td>
                                <td>{reservation.email}</td>
                                <td>{reservation.phone}</td>
                                <td>{reservation.date}</td>
                                <td>{reservation.time}</td>
                                <td>{reservation.numberOfPeople}</td>
                                <td>{reservation.tableNumber}</td>
                                <td>
                                    <img 
                                        src={removeIcon} 
                                        alt="Remove" 
                                        className="remove-icon" 
                                        onClick={() => handleDelete(reservation._id)} 
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className="pagination">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className={currentPage === 1 ? 'disabled' : ''}
                >
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;
                    return (
                        <button 
                            key={pageNumber} 
                            onClick={() => handlePageChange(pageNumber)} 
                            className={currentPage === pageNumber ? 'active' : ''}
                        >
                            {pageNumber}
                        </button>
                    );
                })}

                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? 'disabled' : ''}
                >
                    Next
                </button>
            </div>

            <div className="filter-section">
                <input 
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    placeholderText="From Date"
                />
                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    placeholderText="To Date"
                />
                <button onClick={generateExcelReport}>Generate Report</button>
                {/* <button onClick={handleFilter}>Filter</button> */}
            </div>

            <div className="filter-section">
                
            </div>

            {reportGenerated && (
                <div className="filter-cancel">
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default TableReservation;