// src/components/ContactDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getContact } from '../../api/contact';

const ContactDetails = () => {
    const { id } = useParams();
    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContact = async () => {
            try {
                setLoading(true);
                const data = await getContact(id);
                setContact(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchContact();
    }, [id]);

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>Lỗi: {error}</p>;
    if (!contact) return <p>Không tìm thấy liên hệ</p>;

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Chi tiết liên hệ</h2>
            <div className="card">
                <div className="card-body">
                    <p>
                        <strong>Tên:</strong> {contact.name}
                    </p>
                    <p>
                        <strong>Số điện thoại:</strong> {contact.phone}
                    </p>
                    <p>
                        <strong>Email:</strong> {contact.email}
                    </p>
                    <p>
                        <strong>Tin nhắn:</strong> {contact.message}
                    </p>
                    <Link to="/contacts" className="btn btn-secondary mt-2">
                        Quay lại danh sách
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ContactDetails;
