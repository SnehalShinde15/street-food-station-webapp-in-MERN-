import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import TableReservation from './pages/TableReservation/Tablereservation';
import Users from './pages/Users/Users';
import Feedback from './pages/Feedback/Feedback';
// import AdminHome from './pages/AdminHome/AdminHome'; // Import the AdminHome component
import AdminLogin from './pages/AdminLogin/AdminLogin'; // Import AdminLogin
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'; // Ensure you import ProtectedRoute
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className='app'>
      <ToastContainer />
      <Navbar />
     
      <div className="app-content">
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/*"
              element={
                <>
                  <Sidebar />
                  <Routes>
                    {/* <Route path="/home" element={<AdminHome />} /> */}
                    <Route path="/add" element={<Add />} />
                    <Route path="/list" element={<List />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/tablereservation" element={<TableReservation />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/feedback" element={<Feedback />} />
                  </Routes>
                </>
              }
            />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
