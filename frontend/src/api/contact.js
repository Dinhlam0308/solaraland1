// src/api/contactApi.js
import { api } from './api';

export async function createContact(data) {
    const res = await api.post('/api/contacts', data);
    return res.data;
}
