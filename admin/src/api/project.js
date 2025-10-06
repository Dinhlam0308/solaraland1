// src/api/projectApi.js
import { api } from './api';

// Lấy tất cả Projects
export async function getProjects() {
    const res = await api.get('/api/projects');
    return res.data;
}

// Lấy Project theo ID
export async function getProject(id) {
    const res = await api.get(`/api/projects/${id}`);
    return res.data;
}

// Lấy Project theo slug
export async function getProjectBySlug(slug) {
    const res = await api.get(`/api/projects/slug/${slug}`);
    return res.data;
}

// Tạo mới Project
export async function createProject(data) {
    const headers = data instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : {};
    const res = await api.post('/api/projects', data, { headers });
    return res.data;
}

// Cập nhật Project
export async function updateProject(id, data) {
    const headers = data instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : {};
    const res = await api.put(`/api/projects/${id}`, data, { headers });
    return res.data;
}

// Xóa Project
export async function deleteProject(id) {
    const res = await api.delete(`/api/projects/${id}`);
    return res.data;
}
