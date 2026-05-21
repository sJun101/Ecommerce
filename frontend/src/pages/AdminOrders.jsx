import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  const fetchAllOrders = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/orders/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error("獲取訂單失敗", err);
    }
  };

  useEffect(() => { fetchAllOrders(); }, []);

  // 🎯 修改狀態的邏輯：點擊「發貨」
  const handleShip = async (orderId) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${orderId}/status?status=SHIPPED`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire("成功", "已發貨，通知仙鶴送往道友洞府！", "success");
      fetchAllOrders(); // 重新整理清單
    } catch (err) {
      Swal.fire("失敗", "修改狀態出錯", "error");
    }
  };

  // 狀態顏色標籤
  const getStatusBadge = (status) => {
    switch(status) {
      case 'PENDING': return <span className="badge bg-warning">待處理</span>;
      case 'SHIPPED': return <span className="badge bg-primary">已發貨</span>;
      case 'COMPLETED': return <span className="badge bg-success">已完成</span>;
      default: return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-primary mb-4">📦 全站訂單管理 (管理員模式)</h2>
      <div className="table-responsive shadow-sm">
        <table className="table table-hover align-middle bg-white">
          <thead className="table-dark">
            <tr>
              <th>訂單編號</th>
              <th>用戶名稱</th>
              <th>總金額</th>
              <th>當前狀態</th>
              <th>下單時間</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td># {order.id}</td>
                <td>{order.username}</td>
                <td className="text-success fw-bold">{order.totalPrice} 靈石</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  {order.status === 'PENDING' && (
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleShip(order.id)}>
                      點選發貨
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;