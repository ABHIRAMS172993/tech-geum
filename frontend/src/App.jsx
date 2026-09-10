import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Products from './pages/Products';

function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <nav className="flex justify-between items-center p-4 bg-slate-900 text-white">
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
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <Navigation />
          <main className="max-w-6xl mx-auto p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/products" />} />
              {/* Component views plug in here */}
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<div>Orders Management View</div>} />
              <Route path="/reports" element={<div>Sales Analytics View</div>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}