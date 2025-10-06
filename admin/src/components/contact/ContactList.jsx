// src/components/ContactList.jsx
import React, { useEffect, useState } from 'react';
import { getContacts, deleteContact } from '../../api/contact';
import { Link, useNavigate } from 'react-router-dom';

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const fetchContacts = async (keyword = '') => {
        try {
            setLoading(true);
            // nếu có keyword thì thêm ?name=keyword
            const data = await getContacts(keyword ? `?name=${keyword}` : '');
            setContacts(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xoá liên hệ này?')) {
            try {
                await deleteContact(id);
                setContacts(contacts.filter((c) => c._id !== id));
            } catch (err) {
                alert('Xoá thất bại: ' + err.message);
            }
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchContacts(search);
    };

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Danh sách liên hệ</h2>

            {/* Ô tìm kiếm */}
            <form onSubmit={handleSearch} className="row g-2 mb-3">
                <div className="col-auto">
                    <input
                        type="text"
                        placeholder="Tìm theo tên..."
                        className="form-control"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="col-auto">
                    <button type="submit" className="btn btn-primary">
                        Tìm kiếm
                    </button>
                </div>
                <div className="col-auto">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/dashboard')}
                    >
                        Quay lại Dashboard
                    </button>
                </div>
            </form>

            {/* Danh sách liên hệ */}
            <ul className="list-group">
                {contacts.map((contact) => (
                    <li
                        key={contact._id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <Link to={`/contacts/${contact._id}`}>{contact.name}</Link> -{' '}
                            {contact.phone}
                        </div>
                        <button
                            onClick={() => handleDelete(contact._id)}
                            className="btn btn-sm btn-danger"
                        >
                            Xoá
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContactList;
