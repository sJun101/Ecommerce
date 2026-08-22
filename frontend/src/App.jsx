import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Navbar from './pages/Navbar';
import AdminProducts from './pages/AdminProducts';
import Register from './pages/Register';
import AdminOrders from './pages/AdminOrders';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  const getRoleFromToken = (t) => {
    if (!t) return null;
    try {
      const payload = JSON.parse(window.atob(t.split('.')[1]));
      return payload.role; 
    } catch (e) {
      return null;
    }
  };

  const role = getRoleFromToken(token);

  if (role !== 'ROLE_ADMIN') {
    alert("⚠️ 權限不足！只有管理員能進入。");
    return <Navigate to="/products" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/register" element={<Register />} />
        
        
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          } 
        />

        <Route 
          path="/admin/orders" 
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          } 
        />

        <Route path="/" element={<Navigate to="/login" />} />
        {/*防呆路徑要放在最後面 */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;