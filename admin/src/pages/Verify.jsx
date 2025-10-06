import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../api/auth.js';

export default function Verify() {
    const navigate = useNavigate();
    const [status, setStatus] = useState('Đang xác minh...');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (!token) {
            setStatus('Không có token.');
            return;
        }

        (async () => {
            try {
                const res = await verifyToken(token);

                // linh động lấy token/jwt từ response
                const jwt = res.token || res.jwt || res.access_token;

                if (jwt) {
                    localStorage.setItem('admin_jwt', jwt);
                    setStatus('Xác minh thành công! Đang chuyển tới dashboard...');
                    setTimeout(() => navigate('/dashboard'), 1500);
                } else {
                    setStatus(res.message || 'Token không hợp lệ hoặc đã hết hạn.');
                }
            } catch (err) {
                console.error(err);
                setStatus(err.response?.data?.message || 'Xác minh thất bại.');
            }
        })();
    }, [navigate]);

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="card shadow-lg p-4 text-center" style={{ maxWidth: '400px', width: '100%' }}>
                <p className="mb-0">{status}</p>
            </div>
        </div>
    );
}
