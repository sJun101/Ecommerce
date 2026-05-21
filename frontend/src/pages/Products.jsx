import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Products() {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    

    // 🎯 預設圖路徑 (可替換成你喜歡的 URL)
    const DEFAULT_IMAGE = '/default.png';

    const fetchCart = async () => {
        if (!token) return;
        try {
            const res = await axios.get('http://localhost:8080/api/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(res.data);
        } catch (err) {
            console.error("載入購物車失敗", err);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/products');
            setProducts(res.data);
        } catch (err) {
            console.error("抓取商品失敗", err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    const hasInactiveItem = cartItems.some(item => item.product?.active === false);

    const handleAddToCart = async (productId) => {
        if (!token) { alert("請先登入！"); navigate('/login'); return; }
        try {
            await axios.post(`http://localhost:8080/api/cart/add?productId=${productId}&quantity=1`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCart();
            // 使用 Bootstrap 的 Toast 或簡單 Alert
            alert("成功加入修仙購物車！📜");
        } catch (err) {
            alert("庫存不足或系統錯誤");
        }
    };

    const handleUpdateQty = async (productId, newQty) => {
        if (newQty < 1) return;
        try {
            await axios.put(`http://localhost:8080/api/cart/update?productId=${productId}&quantity=${newQty}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCart();
        } catch (err) {
            console.error("更新數量失敗", err);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await axios.delete(`http://localhost:8080/api/cart/remove/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCart();
        } catch (err) {
            console.error("移除失敗", err);
        }
    };

    const handleCheckout = async () => {
        if (hasInactiveItem) {
            alert("請先移除下架商品再結帳");
            return;
        }
        if (!window.confirm("確定要結帳並清空購物車嗎？")) return;
        try {
            const res = await axios.post('http://localhost:8080/api/orders/checkout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`結帳成功！訂單編號：${res.data.id}`);
            fetchCart();
            // 結帳成功後關閉側邊欄 (如果有打開的話)
            const offcanvasElement = document.getElementById('cartDrawer');
            const busInstance = window.bootstrap.Offcanvas.getInstance(offcanvasElement);
            if(busInstance) busInstance.hide();
        } catch (err) {
            alert("結帳失敗：" + (err.response?.data || "伺服器錯誤"));
        }
    };

    const handleLogout = () => {
        if (window.confirm("確定要登出嗎？")) {
            localStorage.removeItem('token');
            localStorage.removeItem('nickname');
            localStorage.removeItem('role');
            alert("已安全登出！");
            navigate('/login');
        }
    };

    return (
        <div className="container mt-5">
            {/* 頂部標題區 */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <div>
                    <h2 className="fw-bold text-primary mb-0">✨ 修仙寶庫 ✨</h2>
                    <small className="text-muted">道友，歡迎回來修煉</small>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <button className="btn btn-link text-decoration-none text-dark fw-bold" onClick={() => navigate('/orders')}>
                        📜 我的訂單
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                        安全登出
                    </button>
                    <button className="btn btn-dark position-relative" data-bs-toggle="offcanvas" data-bs-target="#cartDrawer">
                        🛒 我的購物車
                        {cartItems.length > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* 商品列表區 */}
            <div className="row">
                {products.length > 0 ? (
                    products.map(p => (
                        <div className="col-md-4 mb-4" key={p.id}>
                            <div className="card h-100 shadow-sm">
                                {/* 🎯 圖片渲染防禦邏輯 */}
                                <img 
                                    src={
                                        (p.imageUrl && typeof p.imageUrl === 'string' && p.imageUrl.trim() !== "")
                                            ? (p.imageUrl.startsWith('http') 
                                                ? p.imageUrl 
                                                : `http://localhost:8080/uploads/${p.imageUrl}`)
                                            : DEFAULT_IMAGE
                                    } 
                                    className="card-img-top" 
                                    alt={p.name} 
                                    style={{ height: '220px', objectFit: 'cover' }}
                                    onError={(e) => { 
                                        e.target.onerror = null; 
                                        e.target.src = DEFAULT_IMAGE; 
                                    }} 
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title fw-bold text-dark">{p.name}</h5>
                                    <p className="card-text text-muted flex-grow-1" style={{ fontSize: '0.9rem' }}>
                                        {p.description || "這件法寶很神祕，沒有留下描述。"}
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <span className="text-danger fw-bold fs-5">${p.price}</span>
                                        <button 
                                            className="btn btn-primary" 
                                            onClick={() => handleAddToCart(p.id)}
                                            disabled={p.stock <= 0}
                                        >
                                            {p.stock <= 0 ? '已售罄' : '加入購物車'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-5">
                        <p className="text-muted">寶庫暫無任何法寶，請聯絡長老上架。</p>
                    </div>
                )}
            </div>

            {/* Offcanvas 側邊欄 (購物車) */}
            <div className="offcanvas offcanvas-end" id="cartDrawer" tabIndex="-1" aria-labelledby="cartDrawerLabel">
                <div className="offcanvas-header border-bottom bg-light">
                    <h5 className="offcanvas-title fw-bold" id="cartDrawerLabel">🛒 您的清單</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    {cartItems.length === 0 ? (
                        <div className="text-center mt-5">
                            <div className="fs-1 mb-3">🎐</div>
                            <p className="text-muted">目前清單空空如也...</p>
                        </div>
                    ) : (
                        <>
                            {cartItems.map(item => (
                                <div 
                                    key={item.id} 
                                    className={`d-flex justify-content-between align-items-center mb-3 p-3 border rounded shadow-sm ${!item.product?.active ? 'bg-light' : ''}`}
                                    style={{ borderLeft: !item.product?.active ? '5px solid #ffc107' : '1px solid #dee2e6' }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div className="fw-bold text-truncate" style={{ maxWidth: '160px' }}>
                                            {item.product?.name || "未知法寶"}
                                            {!item.product?.active && <span className="badge bg-warning text-dark ms-2" style={{fontSize: '0.7rem'}}>已下架</span>}
                                        </div>
                                        <small className={item.product?.active ? "text-primary fw-bold" : "text-decoration-line-through text-muted"}>
                                            ${item.product?.price || 0}
                                        </small>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="btn-group btn-group-sm">
                                            <button className="btn btn-outline-secondary" 
                                                onClick={() => handleUpdateQty(item.product?.id, item.quantity - 1)}
                                                disabled={!item.product?.active || item.quantity <= 1}>-</button>
                                            <span className="btn btn-outline-secondary disabled text-dark fw-bold" style={{ minWidth: '40px' }}>{item.quantity}</span>
                                            <button className="btn btn-outline-secondary" 
                                                onClick={() => handleUpdateQty(item.product?.id, item.quantity + 1)}
                                                disabled={!item.product?.active}>+</button>
                                        </div>
                                        <button className="btn btn-sm btn-outline-danger border-0" onClick={() => handleRemoveItem(item.product?.id)}>
                                            <i className="bi bi-trash"></i> 🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="mt-4 p-3 bg-light rounded">
                                {hasInactiveItem && (
                                    <div className="alert alert-warning py-2 mb-3" style={{ fontSize: '0.85rem' }}>
                                        ⚠️ 內含已下架法寶，請移除後再行結帳。
                                    </div>
                                )}
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-muted">總計金額：</span>
                                    <span className="text-danger fw-bold fs-4">
                                        ${cartItems.reduce((total, item) => total + ((item.product?.price || 0) * item.quantity), 0)}
                                    </span>
                                </div>
                                <button 
                                    className={`btn w-100 btn-lg fw-bold ${hasInactiveItem ? 'btn-secondary' : 'btn-primary'}`} 
                                    onClick={handleCheckout}
                                    disabled={hasInactiveItem}
                                >
                                    {hasInactiveItem ? "請清理清單" : "💰 立即結帳"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Products;