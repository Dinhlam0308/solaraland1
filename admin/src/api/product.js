// src/api/productApi.js
import { api } from './api';

export async function getProducts() {
    const res = await api.get('/api/products');
    return res.data;
}

export async function getProduct(id) {
    const res = await api.get(`/api/products/${id}`);
    return res.data;
}

export async function createProduct(data) {
    const headers = data instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : {};
    const res = await api.post('/api/products', data, { headers });
    return res.data;
}

export async function updateProduct(id, data) {
    const headers = data instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : {};
    const res = await api.put(`/api/products/${id}`, data, { headers });
    return res.data;
}

export async function deleteProduct(id) {
    const res = await api.delete(`/api/products/${id}`);
    return res.data;
}
