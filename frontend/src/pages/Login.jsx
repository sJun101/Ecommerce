import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 🚀 發送登入請求
      const res = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password
      });

      console.log("登入成功回應：", res.data);

      // ✅ 儲存憑證與使用者資訊
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        // 🎯 重點：優先存入 nickname，這會連動到 Navbar 的顯示
        localStorage.setItem('nickname', res.data.nickname || res.data.username);
        
        Swal.fire({
          icon: 'success',
          title: '歡迎回來！',
          text: `尊貴的道友 ${res.data.nickname || res.data.username}，歡迎回到修仙寶庫`,
          timer: 1500,
          showConfirmButton: false
        });

        navigate('/products');
      }
    } catch (err) {
      console.error("登入出錯：", err);
      const errorMsg = err.response?.data || "登入失敗，請檢查道號與真言";
      Swal.fire({
        icon: 'error',
        title: '登入失敗',
        text: errorMsg
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <h3 className="text-center mb-4 fw-bold text-primary">✨ 修仙電商系統 ✨</h3>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label fw-bold">帳號 (道號)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="請輸入帳號"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">密碼 (真言)</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="請輸入密碼"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mt-2">
                  進入寶庫
                </button>
              </form>

              {/* 🎯 註冊入口：解決你提到的「無註冊鈕」問題 */}
              <div className="text-center mt-4 border-top pt-3">
                <p className="text-muted small mb-0">還沒入門嗎？</p>
                <Link to="/register" className="text-decoration-none fw-bold text-success">
                  立即註冊帳號
                </Link>
              </div>
            </div>
          </div>
          <div className="text-center mt-3">
            <small className="text-muted">© 2026 聖鈞修仙工坊 版權所有</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;