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