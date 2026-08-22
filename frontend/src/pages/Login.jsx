import React, { useState } from 'react';
import api from './api';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', {
        username,
        password
      });

      let token = "";
      let nickname = username;

      if (typeof res.data === 'string') {
        token = res.data;
      } else if (res.data && res.data.token) {
        token = res.data.token;
        nickname = res.data.nickname || res.data.username || username;
      }

      if (token && token.startsWith('eyJ')) {
        localStorage.setItem('token', token);
        localStorage.setItem('nickname', nickname);

        Swal.fire({
          icon: 'success',
          title: '登入成功',
          text: `歡迎回來，${nickname}！`,
          timer: 1300,
          showConfirmButton: false
        }).then(() => {
          window.location.href = '/products';
        });

      } else {
        throw new Error("Token 格式不符合規範");
      }
    } catch (err) {
      console.error("登入發生錯誤：", err);
      const errorMsg = err.response?.data || "登入失敗，請檢查帳號與密碼";
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
              <h3 className="text-center mb-4 fw-bold text-primary">會員登入</h3>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label fw-bold">帳號</label>
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
                  <label className="form-label fw-bold">密碼</label>
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
                  登入
                </button>
              </form>

              <div className="text-center mt-4 border-top pt-3">
                <p className="text-muted small mb-0">還沒有帳號嗎？</p>
                <Link to="/register" className="text-decoration-none fw-bold text-success">
                  立即註冊
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;