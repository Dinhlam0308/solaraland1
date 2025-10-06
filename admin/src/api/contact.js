// src/api/contactApi.js
import { api } from './api';

export async function getContacts() {
    const res = await api.get('/api/contacts');
    return res.data;
}

export async function getContact(id) {
    const res = await api.get(`/api/contacts/${id}`);
    return res.data;
}

export async function deleteContact(id) {
    const res = await api.delete(`/api/contacts/${id}`);
    return res.data;
}
