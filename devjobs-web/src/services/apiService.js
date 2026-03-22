import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

const apiService = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Thêm token vào header của mọi request gửi đi
apiService.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('devjobs_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Bắt lỗi 401 (Hết hạn token) để tự động đăng xuất
apiService.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token hết hạn hoặc không hợp lệ -> xóa token và redirect về login (sẽ được handle ở App.jsx hoặc AuthContext)
            console.error('Lỗi 401: Unauthorized');
        }
        return Promise.reject(error);
    }
);

export default apiService;
