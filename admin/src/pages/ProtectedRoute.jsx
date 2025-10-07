import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem('admin_jwt');

    // Nếu chưa có token thì chuyển hướng về trang login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Nếu có token thì render trang được bảo vệ
    return children;
}
