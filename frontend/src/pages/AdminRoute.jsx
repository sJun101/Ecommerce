import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    
    // 解析 Token (JWT 的第二段是 Payload)
    const getRole = () => {
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.role;
        } catch (e) {
            return null;
        }
    };

    const role = getRole();

    if (role !== 'ROLE_ADMIN') {
        alert("權限不足！只有管理員（煉丹長老）能進入此地。");
        return <Navigate to="/products" />;
    }

    return children;
};

export default AdminRoute;