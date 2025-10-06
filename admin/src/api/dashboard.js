import axios from 'axios';

// URL backend (dùng biến môi trường cho dễ deploy)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const dashboardApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Lấy thống kê dashboard
 * @param {Object} params - Tham số query (from, to, groupBy)
 * @returns {Promise<Object>} dữ liệu JSON { todayVisits, todayContacts, visits, products }
 */
export async function getDashboardStats(params = {}) {
    const res = await dashboardApi.get('/api/stats', { params });
    return res.data;
}
