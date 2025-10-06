// src/components/ContactManager.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ContactList from '../../components/contact/ContactList';
import ContactDetails from '../../components/contact/ContactDetails';

const ContactManager = () => {
    return (
        <div>
            <Routes>
                {/* Danh sách liên hệ */}
                <Route path="/" element={<ContactList />} />
                {/* Chi tiết liên hệ */}
                <Route path=":id" element={<ContactDetails />} />
                {/* Nếu đường dẫn không đúng, quay lại danh sách */}
                <Route path="*" element={<Navigate to="/contacts" />} />
            </Routes>
        </div>
    );
};

export default ContactManager;
