import React from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('admin_jwt'); // xóa token
        navigate('/login'); // chuyển hướng về login
    };

    return (
        <div
            className="d-flex flex-column justify-content-between p-3 text-white"
            style={{
                width: '250px',
                height: '100vh',
                backgroundColor: '#343a40',
                position: 'sticky',
                top: 0
            }}
        >
            {/* Phần trên: menu */}
            <div>
                <h4 className="mb-4">Admin</h4>
                <Nav className="flex-column">
                    <Nav.Link href="/dashboard" className="text-white">Dashboard</Nav.Link>
                    <Nav.Link href="/products" className="text-white">Sản phẩm</Nav.Link>
                    <Nav.Link href="/projects" className="text-white">Dự án</Nav.Link>
                    <Nav.Link href="/consign" className="text-white">Ký gửi</Nav.Link>
                    <Nav.Link href="/contacts" className="text-white">Liên hệ</Nav.Link>
                    <Nav.Link href="/news" className="text-white">Tin tức</Nav.Link>
                </Nav>
            </div>

            {/* Phần dưới: nút đăng xuất */}
            <div className="mt-auto">
                <hr className="border-light" />
                <button
                    onClick={handleLogout}
                    className="btn btn-outline-light w-100"
                    style={{ borderRadius: '8px' }}
                >
                    <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
