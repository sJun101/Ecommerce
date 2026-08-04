import React, { useEffect, useState } from 'react';
import api from './api'; // 🎯 改用共用的 api 實例
import { useNavigate } from 'react-router-dom';

function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    // 🛡️ 防護：沒 token 直接踢回登入
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        // 🎯 自動帶入 baseURL 與 Token，不需要手動寫 headers
        const res = await api.get('/api/orders/my');
        console.log("成功抓到訂單資料：", res.data);
        setOrders(res.data);
      } catch (err) {
        console.error("讀取訂單失敗", err);
        if (err.response?.status === 401) {
          alert("身分驗證過期，請重新登入");
          navigate('/login');
        }
      }
    };
    fetchOrders();
  }, [navigate]);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">📜 我的修仙紀錄</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/products')}>
          返回寶庫
        </button>
      </div>
      
      {orders.length === 0 ? (
        <div className="alert alert-light text-center border shadow-sm">
          <p className="mb-0 text-muted">目前尚無任何紀錄，道友請先前往寶庫採購。📜</p>
        </div>
      ) : (
        orders.map(order => (
          <div className="card mb-4 shadow-sm border-0" key={order.id}>
            <div className="card-header bg-dark text-white d-flex justify-content-between">
              <span>訂單編號：<strong>#{order.id}</strong></span>
              <span>📅 {new Date(order.orderDate).toLocaleString()}</span>
            </div>
            <div className="card-body border">
              <table className="table table-sm table-hover">
                <thead className="table-light">
                  <tr>
                    <th>法寶名稱</th>
                    <th className="text-center">單價</th>
                    <th className="text-center">數量</th>
                    <th className="text-end">小計</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map(item => (
                    <tr key={item.id}>
                      <td className="fw-bold">{item.product?.name || '神祕法寶'}</td>
                      <td className="text-center">${item.price}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-end mt-3">
                <span className="text-muted me-2">總計：</span>
                <h4 className="d-inline text-danger fw-bold">${order.totalAmount}</h4>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;