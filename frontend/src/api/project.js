// src/api/projectApi.js
import { api } from './api';

// Lấy tất cả Projects
export const getProjects = async () => {
    try {
        const res = await api.get("/api/projects");
        // Trả đúng mảng
        return res.data.data || res.data;
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
};


// Lấy Project theo ID
export async function getProject(id) {
    const res = await api.get(`/api/projects/${id}`);
    return res.data;
}