import React, { useState, useEffect } from 'react';
import api from './api'; 
import Swal from 'sweetalert2';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', description: '', imageUrl: '' });
  const [selectedFile, setSelectedFile] = useState(null);

  
  const fetchProducts = async () => {
    try {
      const res = await api.get('/products'); 
      setProducts(res.data);
    } catch (err) {
      console.error("獲取商品失敗", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  
  const handleFileUpload = async () => {
    if (!selectedFile) return null;

    const formData = new FormData();
    formData.append('file', selectedFile);

    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://54.238.208.83:8080/api/test/upload');
      
      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          let fileName = "";
          try {
            const data = JSON.parse(xhr.responseText);
            fileName = data.url || data; 
          } catch (e) {
            fileName = xhr.responseText; 
          }
          console.log("✅ 圖片上傳成功，得到檔名:", fileName);
          resolve(fileName);
        } else {
          console.error("❌ 圖片上傳失敗，狀態碼:", xhr.status);
          resolve(null);
        }
      };

      xhr.onerror = () => {
        console.error("❌ 網路連線錯誤，無法上傳");
        resolve(null);
      };

      xhr.send(formData);
    });
  };

  // 3. 新增商品邏輯
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      let finalImageUrl = "";

      if (selectedFile) {
        Swal.fire({ title: '上傳中...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const uploadedFileName = await handleFileUpload();
        Swal.close();

        if (uploadedFileName) {
          finalImageUrl = uploadedFileName;
        } else {
          const confirmWithoutImg = await Swal.fire({
            title: "圖片上傳失敗",
            text: "是否要不帶圖片直接上架？",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "直接上架",
            cancelButtonText: "取消並檢查"
          });
          if (!confirmWithoutImg.isConfirmed) return;
        }
      }

      const productToSave = { 
        ...newProduct, 
        imageUrl: finalImageUrl 
      };
      
      
      const res = await api.post('/products', productToSave);

      if (res.status === 200 || res.status === 201) {
        Swal.fire("成功", "商品已上架！", "success");
        setNewProduct({ name: '', price: '', stock: '', description: '', imageUrl: '' });
        setSelectedFile(null);
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = "";
        fetchProducts();
      }
    } catch (err) {
      console.error("❌ 商品存檔失敗:", err);
      Swal.fire("失敗", "商品存檔失敗，請確認後端是否運作", "error");
    }
  };

  // 4. 下架邏輯
  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "確定下架此商品嗎？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "下架"
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      // 🎯 改用 api.delete，自動夾帶 Token
      await api.delete(`/api/products/${id}`);
      fetchProducts();
      Swal.fire("已下架", "該商品已下架", "success");
    } catch (err) {
      Swal.fire("失敗", "下架失敗", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-danger mb-4">⚒️ 煉丹房 (管理員面板)</h2>

      {/* 上架表單 */}
      <div className="card shadow-sm border-0 mb-5">
        <div className="card-header bg-primary text-white fw-bold">✨ 上架新商品</div>
        <div className="card-body">
          <form onSubmit={handleAddProduct} className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-bold">商品名稱</label>
              <input type="text" className="form-control" placeholder="如：可口可樂" 
                value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold">價格 </label>
              <input type="number" className="form-control" 
                value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold">庫存數量</label>
              <input type="number" className="form-control" 
                value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} required />
            </div>
            
            <div className="col-md-8">
              <label className="form-label small fw-bold">商品照片 (圖片上傳)</label>
              <input type="file" id="fileInput" className="form-control" accept="image/*"
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) {
                    console.log("📂 已選取檔案:", file.name);
                    setSelectedFile(file);
                  }
                }} />
            </div>

            <div className="col-md-4 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100 fw-bold">確認上架</button>
            </div>
          </form>
        </div>
      </div>

      {/* 庫存列表 */}
      <h4 className="mb-3 fw-bold text-secondary">📊 現有商品清單</h4>
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle bg-white mb-0">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>照片</th>
              <th>名稱</th>
              <th>價格</th>
              <th>庫存</th>
              <th className="text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  {p.imageUrl ? (
                    <img 
                      src={p.imageUrl.startsWith('http') 
                        ? p.imageUrl 
                        : `http://54.238.208.83:8080/uploads/${p.imageUrl}`} 
                      alt={p.name} 
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                      className="rounded border" 
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                    />
                  ) : (
                    <span className="text-muted small">無圖</span>
                  )}
                </td>
                <td className="fw-bold">{p.name}</td>
                <td><span className="text-success fw-bold">{p.price}</span> 元</td>
                <td>{p.stock}</td>
                <td className="text-center">
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>
                    下架
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;