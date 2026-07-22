import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    
    const getRole = () => {
        if (!token) return null;
        try {
            const sections = token.split('.');
            if (sections.length < 2) return null;
            const payload = JSON.parse(atob(sections[1]));
            return payload.role;
        } catch (e) {
            console.error("解析 Token 身分失敗:", e);
            return null;
        }
    };

    const role = getRole();
    console.log("🛡️ 當前門衛檢查身分勳章為:", role);

    // 🎯 測試小撇步：如果你的後端還沒做 role，這裡可以先暫時改成： if(!token)
    if (role !== 'ROLE_ADMIN') {
        alert("⚠️ 權限不足！只有管理員（煉丹長老）能進入此地。");
        return <Navigate to="/products" />;
    }

    return children;
};

export default AdminRoute;