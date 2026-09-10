import React from 'react'
import { Link } from "react-router-dom"
import { useAuth } from '../context/AuthContext';
const Navbar = () => {

  const { isAuthenticated, logout } = useAuth();

  return (
    <>
    <nav className="flex justify-between items-center p-4 m-0 bg-slate-900 text-white">
      <div className="flex gap-6 font-semibold">
        <Link to="/products">Products</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/reports">Sales Report</Link>
      </div>
      <div>
        {isAuthenticated ? (
          <button onClick={logout} className="bg-rose-600 px-3 py-1 rounded text-sm">
            Logout
          </button>
        ) : (
          <Link to="/login" className="bg-indigo-600 px-3 py-1 rounded text-sm">
            Login/Register
          </Link>
        )}
      </div>
    </nav>
    </>
  )
}

export default Navbar