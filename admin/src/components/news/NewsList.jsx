import React, { useEffect, useState } from 'react';
import { getNewsList, deleteNews } from '../../api/news';
import { Link, useNavigate } from 'react-router-dom';

export default function NewsList() {
    const [news, setNews] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 20;
    const navigate = useNavigate();

    // Lấy danh sách
    useEffect(() => {
        getNewsList().then(setNews);
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Xóa tin tức này?')) {
            await deleteNews(id);
            setNews((prev) => prev.filter((n) => n._id !== id));
        }
    };

    // Lọc theo search
    const filtered = news.filter((n) =>
        n.title.toLowerCase().includes(search.toLowerCase())
    );

    // Tính toán phân trang
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h3">Danh sách tin tức</h1>
                <div className="d-flex gap-2">
                    {/* nút quay về dashboard */}
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-secondary"
                    >
                        ← Quay về Dashboard
                    </button>

                    <Link to="/news/create" className="btn btn-primary">
                        + Thêm tin mới
                    </Link>
                </div>
            </div>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm theo tiêu đề..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1); // reset về trang 1 khi search
                    }}
                />
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-light">
                <tr>
                    <th style={{ width: '60px' }}>Ảnh</th>
                    <th>Tiêu đề</th>
                    <th>Slug</th>
                    <th style={{ width: '150px' }}>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {paginated.map((n) => (
                    <tr key={n._id}>
                        <td>
                            {n.thumbnail ? (
                                <img
                                    src={n.thumbnail}
                                    alt=""
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <span className="text-muted">No Img</span>
                            )}
                        </td>
                        <td>{n.title}</td>
                        <td>{n.slug}</td>
                        <td>
                            <Link
                                to={`/news/edit/${n._id}`}
                                className="btn btn-sm btn-warning me-2"
                            >
                                Sửa
                            </Link>
                            <button
                                onClick={() => handleDelete(n._id)}
                                className="btn btn-sm btn-danger"
                            >
                                Xóa
                            </button>
                        </td>
                    </tr>
                ))}
                {paginated.length === 0 && (
                    <tr>
                        <td colSpan={4} className="text-center">
                            Không có dữ liệu
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(page - 1)}>
                                «
                            </button>
                        </li>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <li
                                key={i}
                                className={`page-item ${page === i + 1 ? 'active' : ''}`}
                            >
                                <button className="page-link" onClick={() => setPage(i + 1)}>
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        <li
                            className={`page-item ${page === totalPages ? 'disabled' : ''}`}
                        >
                            <button className="page-link" onClick={() => setPage(page + 1)}>
                                »
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}
