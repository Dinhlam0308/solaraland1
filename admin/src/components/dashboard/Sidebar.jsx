import React from 'react';
import { Nav } from 'react-bootstrap';

const Sidebar = () => {
    return (
        <div
            className="p-3 text-white"
            style={{
                width: '250px',
                height: '100vh',
                backgroundColor: '#343a40', // màu nền sidebar (xám đậm)
                position: 'sticky',
                top: 0
            }}
        >
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
    );
};
export default Sidebar;