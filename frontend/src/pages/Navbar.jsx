import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  // 🎯 1. 從 localStorage 拿暱稱與角色
  const nickname = localStorage.getItem('nickname') || '道友';
  
  // 🎯 2. 解析角色邏輯 (判斷是否為長老)
  const getRole = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      return payload.role; // 拿取 JWT 裡的 ROLE_ADMIN 或 ROLE_USER
    } catch (e) {
      return null;
    }
  };
  const role = getRole();

  const handleLogout = () => {
    if (window.confirm("確定要登出並結束本次修煉嗎？")) {
      // 🎯 3. 登出時要清乾淨，包含 nickname
      localStorage.removeItem('token');
      localStorage.removeItem('nickname');
      navigate('/login');
    }
  };

  if (!token) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-4 sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/products">
          ✨ 修仙寶庫
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/products">進入寶庫</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orders">我的訂單</Link>
            </li>
            
            {/* 🎯 4. 權限過濾：只有長老 (ROLE_ADMIN) 才能看到管理入口 */}
            {role === 'ROLE_ADMIN' && (
              <>
              <li className="nav-item">
                <Link className="nav-link text-warning" to="/admin">煉丹房管理</Link>
              </li>
              <li className="nav-item">
                  <Link className="nav-link text-info" to="/admin/orders">全站訂單</Link>
                </li>
              </>
            )}
          </ul>
          
          <div className="d-flex align-items-center gap-3">
            {/* 🎯 5. 動態顯示註冊時填寫的暱稱 */}
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