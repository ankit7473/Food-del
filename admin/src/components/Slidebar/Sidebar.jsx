import React from 'react'
import { assets } from '../../assets/assets'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'
const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar_options">
        <NavLink to='/add' className="sidebar_option">
            <img src={assets.add_icon} alt="" />
            <p>Add items</p>
        </NavLink>
        <NavLink to="/list" className="sidebar_option">
            <img src={assets.order_icon} alt="" />
            <p>List Items</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar_option">
            <img src={assets.order_icon} alt="" />
            <p>Ordes</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
