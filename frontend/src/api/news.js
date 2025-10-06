import { api } from './api';

export async function getNewsList() {
    const res = await api.get('/api/news');
    // backend trả về array news (theo code bạn hiện tại)
    return res.data; // trả ra mảng news
}

// Lấy news theo id
export async function getNewsBySlug(slug) {
    const res = await api.get(`/api/news/${slug}`); // hoặc /api/news/slug/:slug tùy route
    return res.data;
}