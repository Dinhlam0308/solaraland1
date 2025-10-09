import React, { useEffect, useState } from 'react';
import { getProjects, deleteProject } from '../../api/project'; // import đúng hàm
import { Link, useNavigate } from 'react-router-dom';

export default function ProjectList() {
    const [projects, setProjects] = useState([]); // mặc định là mảng
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const navigate = useNavigate();

    // Lấy danh sách dự án
    useEffect(() => {
        getProjects().then((res) => {
            // nếu API trả về mảng trực tiếp
            if (Array.isArray(res)) {
                setProjects(res);
            } else if (res && Array.isArray(res.data)) {
                // nếu API trả { success:true, data:[…] }
                setProjects(res.data);
            } else {
                setProjects([]); // fallback
            }
        });
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Xóa dự án này?')) {
            await deleteProject(id);
            setProjects((prev) => prev.filter((p) => p._id !== id));
        }
    };

    // Lọc theo search (theo tên dự án hoặc chủ đầu tư)
    const filtered = projects.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const investor = (p.investor || '').toLowerCase();
        const term = search.toLowerCase();
        return name.includes(term) || investor.includes(term);
    });

    // Tính toán phân trang
    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h3">Danh sách Dự án</h1>
                <div className="d-flex gap-2">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-secondary"
                    >
                        ← Quay về Dashboard
                    </button>

                    <Link to="/projects/create" className="btn btn-primary">
                        + Thêm dự án mới
                    </Link>
                </div>
            </div>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm theo tên dự án hoặc chủ đầu tư..."
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
                    <th>Tên dự án</th>
                    <th>Địa điểm</th>
                    <th>Chủ đầu tư</th>
                    <th style={{ width: '150px' }}>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {paginated.map((p) => (
                    <tr key={p._id}>
                        <td>{p.name}</td>
                        <td>{p.location}</td>
                        <td>{p.investor}</td>
                        <td>
                            <Link
                                to={`/projects/edit/${p._id}`}
                                className="btn btn-sm btn-warning me-2"
                            >
                                Sửa
                            </Link>
                            <button
                                onClick={() => handleDelete(p._id)}
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
                        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
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
