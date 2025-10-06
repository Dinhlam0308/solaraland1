// src/api/consignApi.js
import { api } from './api';

export async function createConsign(data) {
    const res = await api.post('/api/consigns', data);
    return res.data;
}
