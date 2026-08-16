import React, { useEffect, useState } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

function Products() {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    const DEFAULT_IMAGE = '/default.png';

    // 1. 載入購物車 (自動帶入 /api 前綴)
    const fetchCart = async () => {
        if (!token) return;
        try {
            const res = await api.get('/cart'); 
            setCartItems(res.data);
        } catch (err) {
            console.error("❌ 載入購物車失敗", err);
        }
    };

    // 2. 抓取商品列表 (自動帶入 /api 前綴)
    const fetchProducts = async () => {
        try {
            const res = await api.get('/products'); 
            setProducts(res.data);
        } catch (err) {
            console.error("❌ 抓取商品失敗", err);
        }
    };

    useEffect(() => {
        if (!token) {
            alert("請先登入宗門！");
            navigate('/login');
            return;
        }
        fetchProducts();
        fetchCart();
    }, [token, navigate]);

    const hasInactiveItem = cartItems.some(item => item.product?.active === false);

    const handleAddToCart = async (productId) => {
        if (!token) { alert("請先登入！"); navigate('/login'); return; }
        try {
            // 🎯 修正：拿掉手動寫的 /api，改用純相對路徑
            await api.post('/cart/add', {
                productId: productId,
                quantity: 1
            });
            fetchCart();
            alert("成功加入修仙購物車！📜");
        } catch (err) {
            alert("加入失敗");
        }
    };

    const handleUpdateQty = async (productId, newQty) => {
       if (newQty < 1) return;
        try {
            // 🎯 修正：拿掉手動寫的 /api
            await api.put(`/cart/update?productId=${productId}&quantity=${newQty}`);
            fetchCart();
        } catch (err) {
            console.error("更新數量失敗", err);
        }
    };

    const handleRemoveItem = async (productId) => {
      try {
        // 🎯 修正：拿掉手動寫的 /api
        await api.delete(`/cart/remove/${productId}`);
        fetchCart();
    } catch (err) {
        console.error("移除失敗", err);
        alert("從購物車移除商品失敗");
    }
    };

    const handleCheckout = async () => {
        if (hasInactiveItem) {
            alert("請先移除下架商品再結帳");
            return;
        }
        if (!window.confirm("確定要結帳並清空購物車嗎？")) return;
        try {
            const res = await api.post('/orders/checkout', {});
            alert(`結帳成功！訂單編號：${res.data.id}`);
            fetchCart();
            
            const offcanvasElement = document.getElementById('cartDrawer');
            if (offcanvasElement && window.bootstrap) {
                const busInstance = window.bootstrap.Offcanvas.getInstance(offcanvasElement);
                if(busInstance) busInstance.hide();
            }
        } catch (err) {
            alert("結帳失敗：" + (err.response?.data || "伺服器錯誤"));
        }
    };

    const handleLogout = () => {
        if (window.confirm("確定要登出嗎？")) {
            localStorage.clear();
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
                                <img 
                                    src={
                                        (p.imageUrl && typeof p.imageUrl === 'string' && p.imageUrl.trim() !== "")
                                            ? (p.imageUrl.startsWith('http') 
                                                ? p.imageUrl 
                                                : `http://54.238.208.83:8080/uploads/${p.imageUrl}`)
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
                    <div className="text-center py-5 w-100">
                        <p className="text-muted">寶庫暫無任何法寶，請聯絡長老上架，或確認後端連線。</p>
                    </div>
                )}
            </div>

            {/* Offcanvas 側邊欄 */}
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
                                            🗑️
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