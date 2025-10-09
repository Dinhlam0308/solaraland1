import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';

const AdminLayout = ({ children }) => {
    return (
        <div className="d-flex">
            {/* Sidebar cố định */}
            <Sidebar />

            {/* Phần nội dung */}
            <div className="flex-grow-1 bg-light" style={{ minHeight: '100vh' }}>
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;
