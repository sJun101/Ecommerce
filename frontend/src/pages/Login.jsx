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

      console.log("🚀 登入成功回應原始資料：", res.data);

      // 🎯 自動相容性判定：管你後端回傳物件還是字串，通通抓出 Token！
      let token = "";
      let nickname = username;

      if (typeof res.data === 'string') {
        token = res.data;
      } else if (res.data && res.data.token) {
        token = res.data.token;
        nickname = res.data.nickname || res.data.username || username;
      }

      // 驗證 Token 是否有效
      if (token && token.startsWith('eyJ')) {
        localStorage.setItem('token', token);
        localStorage.setItem('nickname', nickname);
        
        console.log("✅ Token 已成功寫入本地儲存區");

        Swal.fire({
          icon: 'success',
          title: '歡迎回來！',
          text: `尊貴的道友 ${nickname}，歡迎回到修仙寶庫`,
          timer: 1300,
          showConfirmButton: false
        }).then(() => {
          console.log("🎬 彈窗關閉，強制帶路跳轉！");
          // 🎯 這裡改用 window.location.href 強制突圍，防止 React 路由卡死
          window.location.href = '/products';
        });

      } else {
        throw new Error("通行證格式不符合 JWT 規範，請檢查後端發行端");
      }
    } catch (err) {
      console.error("❌ 登入發生錯誤：", err);
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
              <h3 className="text-center mb-4 fw-bold text-primary">✨ 電商系統 ✨</h3>
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

              <div className="text-center mt-4 border-top pt-3">
                <p className="text-muted small mb-0">還沒入門嗎？</p>
                <Link to="/register" className="text-decoration-none fw-bold text-success">
                  立即註冊帳號
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