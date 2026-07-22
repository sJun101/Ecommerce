import axios from 'axios';
import Swal from 'sweetalert2';

// 建立 Axios 實例，設定後端 base URL
const api = axios.create({
    baseURL: 'http://localhost:8080/api', 
});

// 1. 請求攔截器：每次發送請求前，自動把 Token 塞進去
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. 回應攔截器：統一處理錯誤，前端頁面就不用寫一大堆 try-catch
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || '伺服器發生錯誤';
        const status = error.response?.status;

        if (status === 403) {
            Swal.fire('權限不足', '您沒有權限執行此操作。', 'error');
        } else if (status === 401) {
            Swal.fire('登入逾期', '請重新登入以繼續。', 'warning');
            localStorage.removeItem('token'); // 清除過期 token
            window.location.href = '/login';
        } else {
            Swal.fire('發生錯誤', message, 'error');
        }
        
        return Promise.reject(error);
    }
);

export default api;