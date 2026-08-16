import React, { useState, useEffect } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchAllOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data);
    } catch (err) {
      console.error("取得全站訂單失敗", err);
      Swal.fire({
        icon: 'error',
        title: '權限不足',
        text: '您沒有管理員權限或尚未登入'
      }).then(() => {
        navigate('/login');
      });
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`api/admin/orders/${orderId}/status`, null, {
        params: { status: newStatus }
      });
      Swal.fire({
        icon: 'success',
        title: '更新成功',
        text: `訂單狀態已變更為：${newStatus}`,
        timer: 1000,
        showConfirmButton: false
      });
      fetchAllOrders();
    } catch (err) {
      console.error("更新狀態失敗", err);
      Swal.fire('錯誤', '更新訂單狀態失敗', 'error');
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👑 管理員專區 - 全站訂單管理</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/products')}>
          返回商品寶庫
        </button>
      </div>

      <div className="card shadow border-0 p-4">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>訂單編號</th>
              <th>買家道號</th>
              <th>總金額</th>
              <th>目前狀態</th>
              <th>操作控制 (狀態流轉)</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">目前尚無任何全站訂單</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td><span className="fw-bold text-primary">{order.buyerUsername}</span></td>
                  <td>${order.totalAmount}</td>
                  <td>
                    <span className={`badge ${
                      order.status === '待出貨' ? 'bg-warning text-dark' :
                      order.status === '已出貨' ? 'bg-info text-dark' :
                      order.status === '已到貨' ? 'bg-primary' : 'bg-success'
                    }`}>
                      {order.status || '待出貨'}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-warning" onClick={() => handleUpdateStatus(order.id, '待出貨')}>待出貨</button>
                      <button className="btn btn-outline-info" onClick={() => handleUpdateStatus(order.id, '已出貨')}>已出貨</button>
                      <button className="btn btn-outline-primary" onClick={() => handleUpdateStatus(order.id, '已到貨')}>已到貨</button>
                      <button className="btn btn-outline-success" onClick={() => handleUpdateStatus(order.id, '已取貨')}>已取貨</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;