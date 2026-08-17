import { useNavigate, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function Navbar() {
  const [role, setRole] = useState(null);
  const [nickname, setNickname] = useState('會員');

  // 使用 useEffect 在頁面切換或 Token 變動時重新讀取
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedNickname = localStorage.getItem('nickname');
    
    if (token) {
      setNickname(storedNickname || '會員');
      try {
        const payload = JSON.parse(window.atob(token.split('.')[1]));
        setRole(payload.role);
      } catch (e) {
        setRole(null);
      }
    }
  }, []); // 空陣列代表只在組件掛載時執行

  // 登出時順便清除狀態
  const handleLogout = () => {
    if (window.confirm("確定要登出系統嗎？")) {
      localStorage.clear(); // 直接清除所有相關資料
      window.location.href = '/login'; // 強制轉址
    }
  };

  // 隱藏 Navbar 的判斷
  const token = localStorage.getItem('token');
  if (!token) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-4 sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/products">
          ✨ 線上商店
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/products">商品列表</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orders">我的訂單</Link>
            </li>
            
            {/* 🎯 權限過濾：只有管理員 (ROLE_ADMIN) 才能看到管理入口 */}
            {role === 'ROLE_ADMIN' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-warning" to="/admin">商品管理</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-info" to="/admin/orders">訂單管理</Link>
                </li>
              </>
            )}
          </ul>
          
          <div className="d-flex align-items-center gap-3">
            {/* 🎯 動態顯示註冊時填寫的暱稱 */}
            <span className="text-light opacity-75 small">
              {nickname}，歡迎回來
            </span>
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              安全登出
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;