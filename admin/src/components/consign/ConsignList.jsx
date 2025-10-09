import React, { useEffect, useState } from 'react';
import { getConsigns, deleteConsign } from '../../api/consign';
import { Link, useNavigate } from 'react-router-dom';

const ConsignList = () => {
    const [consigns, setConsigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // 👈 trạng thái trang hiện tại
    const consignsPerPage = 10; // 👈 hiển thị 10 bản ghi mỗi trang

    const navigate = useNavigate();

    const fetchConsigns = async () => {
        try {
            setLoading(true);
            const data = await getConsigns();
            setConsigns(data);
        } catch (err) {
            console.error('Error fetching consigns', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConsigns();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xoá consign này?')) {
            await deleteConsign(id);
            fetchConsigns();
        }
    };

    // 🔍 Lọc consign theo tên hoặc dự án
    const filteredConsigns = consigns.filter((c) => {
        const nameMatch = c.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const projectMatch = c.project?.toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || projectMatch;
    });

    // 🔢 Tính toán phân trang
    const totalPages = Math.ceil(filteredConsigns.length / consignsPerPage);
    const startIndex = (currentPage - 1) * consignsPerPage;
    const currentConsigns = filteredConsigns.slice(startIndex, startIndex + consignsPerPage);

    // 🔁 Xử lý chuyển trang
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Danh sách Consigns</h2>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="btn btn-secondary"
                >
                    ⬅ Quay lại Dashboard
                </button>
            </div>

            {/* Ô tìm kiếm */}
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc dự án..."
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // reset về trang 1 khi tìm kiếm
                    }}
                />
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-dark">
                    <tr>
                        <th>Tên</th>
                        <th>Dự án</th>
                        <th>Loại căn hộ</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentConsigns.map((c) => (
                        <tr key={c._id}>
                            <td>
                                <Link to={`/consign/${c._id}`} className="text-decoration-none">
                                    {c.name}
                                </Link>
                            </td>
                            <td>{c.project}</td>
                            <td>{c.apartmentType}</td>
                            <td>
                                    <span
                                        className={`badge ${
                                            c.transactionStatus === 'available'
                                                ? 'bg-success'
                                                : c.transactionStatus === 'sold'
                                                    ? 'bg-danger'
                                                    : 'bg-warning text-dark'
                                        }`}
                                    >
                                        {c.transactionStatus}
                                    </span>
                            </td>
                            <td>
                                <button
                                    onClick={() => handleDelete(c._id)}
                                    className="btn btn-sm btn-danger"
                                >
                                    <i className="bi bi-trash3"></i> Xoá
                                </button>
                            </td>
                        </tr>
                    ))}

                    {currentConsigns.length === 0 && (
                        <tr>
                            <td colSpan="5" className="text-center">
                                Không tìm thấy consign nào
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-3">
                    <button
                        className="btn btn-outline-primary me-2"
                        disabled={currentPage === 1}
                        onClick={() => goToPage(currentPage - 1)}
                    >
                        ← Trước
                    </button>

                    <span>
                        Trang {currentPage} / {totalPages}
                    </span>

                    <button
                        className="btn btn-outline-primary ms-2"
                        disabled={currentPage === totalPages}
                        onClick={() => goToPage(currentPage + 1)}
                    >
                        Sau →
                    </button>
                </div>
            )}
        </div>
    );
};

export default ConsignList;
