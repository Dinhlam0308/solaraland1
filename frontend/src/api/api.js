// src/api/api.js
import axios from 'axios';

const API_URL = 'https://api.solaraland.vn';
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
