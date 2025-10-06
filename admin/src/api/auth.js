import { api } from './api';

export async function requestLogin(email) {
    const res = await api.post('/admin/request-login', { email });
    return res.data;
}

export async function verifyToken(token) {
    const res = await api.post('/admin/verify-token', { token });
    return res.data;
}
