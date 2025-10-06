import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Dashboard from '../pages/Dashboard';

const AdminLayout = () => {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1">
                <Dashboard />
            </div>
        </div>
    );
};

export default AdminLayout;
