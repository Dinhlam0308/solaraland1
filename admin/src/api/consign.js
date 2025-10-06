// src/api/consignApi.js
import { api } from './api';

export async function getConsigns() {
    const res = await api.get('/api/consigns');
    return res.data;
}

export async function getConsign(id) {
    const res = await api.get(`/api/consigns/${id}`);
    return res.data;
}

export async function updateConsignStatus(id, transactionStatus) {
    const res = await api.put(`/api/consigns/${id}/status`, { transactionStatus });
    return res.data;
}

export async function deleteConsign(id) {
    const res = await api.delete(`/api/consigns/${id}`);
    return res.data;
}
