// src/api/news.js
import { api } from './api'; // instance axios

// Lấy danh sách tất cả news
export async function getNewsList() {
    const res = await api.get('/api/news');
    // backend trả về array news (theo code bạn hiện tại)
    return res.data; // trả ra mảng news
}

// Lấy news theo id
export async function getNewsById(id) {
    const res = await api.get(`/api/news/id/${id}`);
    return res.data; // trả ra object news
}

// Lấy news theo slug
export async function getNewsBySlug(slug) {
    const res = await api.get(`/api/news/${slug}`);
    return res.data; // trả ra object news
}

// Tạo news mới
export async function createNews(data) {
    // Nếu data là FormData (có file upload) thì set headers multipart/form-data
    const headers = data instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : {};
    const res = await api.post('/api/news', data, { headers });
    return res.data; // trả ra object news vừa tạo
}

// Cập nhật news
export async function updateNews(id, data) {
    const headers = data instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : {};
    const res = await api.put(`/api/news/${id}`, data, { headers });
    return res.data; // trả ra object news sau khi update
}

// Xóa news
export async function deleteNews(id) {
    const res = await api.delete(`/api/news/${id}`);
    return res.data; // trả ra message xóa thành công
}
