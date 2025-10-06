import React, { useState } from 'react';
import { requestLogin } from '../api/auth.js';

export default function Login() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await requestLogin(email);
            setMessage(res.message || 'Hãy kiểm tra email để nhận link đăng nhập.');
        } catch (err) {
            setMessage('Có lỗi xảy ra, vui lòng thử lại.');
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark">
            <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="text-center mb-4">
                    <i className="bi bi-key-fill" style={{ fontSize: '3rem', color: '#00c3c3' }}></i>
                    <h2 className="mt-2 mb-0">ADMIN PANEL</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email Admin"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            GỬI LINK ĐĂNG NHẬP
                        </button>
                    </div>
                </form>

                {message && (
                    <div className="alert alert-info mt-3 text-center py-2" role="alert">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
