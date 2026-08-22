import React, { useState } from 'react';
import api from './api'; 
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nickname: ''
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      
      Swal.fire({
        icon: 'success',
        title: '築基成功！',
        text: '您的道號已錄入仙籍，請重新登入。',
        confirmButtonText: '前往登入'
      }).then(() => {
        navigate('/login');
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: '註冊失敗',
        text: err.response?.data || "此道號可能已被佔用"
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">
              <h2 className="text-center mb-4 fw-bold text-success">📜 加入門派 📜</h2>
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label fw-bold">帳號 (登入用)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="請輸入帳號"
                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">如何稱呼您？(顯示名)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="例如：聖鈞長老"
                    onChange={(e) => setFormData({...formData, nickname: e.target.value})} 
                    required 
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold">設定密碼</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="請輸入密碼"
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-success w-100 fw-bold py-2">
                  完成註冊
                </button>
              </form>
              <div className="text-center mt-3">
                <Link to="/login" className="text-decoration-none text-muted">
                  已有帳號？點此登入
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;