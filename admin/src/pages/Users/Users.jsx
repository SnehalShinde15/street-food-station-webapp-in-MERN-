    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import * as XLSX from 'xlsx';
    import './Users.css';
    import removeIcon from '../../assets/remove.png';

    function Users() {
        const [users, setUsers] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [currentPage, setCurrentPage] = useState(1);
        const itemsPerPage = 5;

        // State for date range filter
        const [startDate, setStartDate] = useState('');
        const [endDate, setEndDate] = useState('');

        useEffect(() => {
            const fetchUsers = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get('http://localhost:4000/api/user');
                    setUsers(response.data);
                } catch (error) {
                    console.error('Error fetching users:', error);
                    setError("Failed to fetch users");
                } finally {
                    setLoading(false);
                }
            };
            fetchUsers();
        }, []);

        const handleDelete = async (id) => {
            try {
                await axios.delete(`http://localhost:4000/api/user/${id}`);
                setUsers(users.filter((user) => user._id !== id));
            } catch (error) {
                console.error('Error deleting user:', error);
                setError('Failed to delete user. Please try again later.');
            }
        };

        const exportToExcel = () => {
            // Filter users by selected date range
            const filteredUsers = users.filter(user => {
                const createdAt = new Date(user.createdAt);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return createdAt >= start && createdAt <= end;
            });

            if (filteredUsers.length === 0) {
                alert("No users found in the selected date range.");
                return;
            }

            // Prepare data for export
            const data = filteredUsers.map(user => ({
                Name: user.name,
                Email: user.email,
                CreatedAt: new Date(user.createdAt).toLocaleDateString(),
            }));

            // Create worksheet and workbook
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Users Report');

            // Export the workbook to an Excel file
            XLSX.writeFile(workbook, 'Users_Report.xlsx');
        };

        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error}</div>;

        // Pagination logic
        const totalItems = users.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

        const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

        return (
            <div className="users-container">
                <h1>Users</h1>

                

                {users.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>CreatedAt</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((user) => (
                                <tr key={user._id}>
                                    <td data-label="Name">{user.name}</td>
                                    <td data-label="Email">{user.email}</td>
                                    <td data-label="CreatedAt">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <img 
                                            src={removeIcon} 
                                            alt="Remove" 
                                            className="remove-icon" 
                                            onClick={() => handleDelete(user._id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}



                {/* Pagination controls */}
                <div className="pagination">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1}
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
                    >
                        Next
                    </button>
                </div>


                {/* Date Range Filters */}
                <div className="date-filters">
                    
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                        />
                    
                    
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                        />
                    
                    <button onClick={exportToExcel} className="export-button">
                        Generate report
                    </button>
                </div>
            </div>
        );
    }

    export default Users;
