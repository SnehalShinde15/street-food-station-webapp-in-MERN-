import React from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/add" className="sidebar-option" activeClassName="active">
          <img src={assets.add_icon} alt="Add Items" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to="/list" className="sidebar-option" activeClassName="active">
          <img src={assets.order_icon} alt="List Items" />
          <p>List Items</p>
        </NavLink>
        <NavLink to="/orders" className="sidebar-option" activeClassName="active">
          <img src={assets.order_icon} alt="Orders" />
          <p>Orders</p>
        </NavLink>
        <NavLink to="/tablereservation" className="sidebar-option" activeClassName="active">
          <img src={assets.order_icon} alt="Table Reservations" />
          <p>Table Reservations</p>
        </NavLink>
        <NavLink to="/users" className="sidebar-option" activeClassName="active">
          <img src={assets.order_icon} alt="Users" />
          <p>Users</p>
        </NavLink>
        <NavLink to="/feedback" className="sidebar-option" activeClassName="active">
          <img src={assets.order_icon} alt="Feedback" />
          <p>Feedback</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
