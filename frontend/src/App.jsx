import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Products from './pages/Products';
import Credential from './pages/Credential';
import Register from './components/Register';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <main className="max-w-6xl mx-auto p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/products" />} />
              <Route path="/login" element={<Credential />} />
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