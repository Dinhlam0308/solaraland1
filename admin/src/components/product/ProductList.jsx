import React, { useEffect, useState, useMemo } from 'react';
import { getProducts, deleteProduct, updateProduct } from '../../api/product';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 20;

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
            await deleteProduct(id);
            loadProducts();
        }
    };

    const toggleHidden = async (product) => {
        await updateProduct(product._id, { hidden: !product.hidden });
        loadProducts();
    };

    // lọc theo tên
    const filteredProducts = useMemo(() => {
        if (!searchTerm.trim()) return products;
        return products.filter((p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    // phân trang
    const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredProducts.slice(start, start + PAGE_SIZE);
    }, [filteredProducts, currentPage]);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage((p) => p - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((p) => p + 1);
    };

    return (
        <div
            className="container"
            style={{ padding: '10px' }} // căn lề trên và hai bên 10px
        >
            <h2 className="mb-2 mt-0">Danh sách sản phẩm</h2>

            <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <button
                        className="btn btn-success me-2"
                        onClick={() => navigate('/products/create')}
                    >
                        Tạo sản phẩm mới
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/dashboard')}
                    >
                        Quay lại Dashboard
                    </button>
                </div>
                <div style={{ width: '250px' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm theo tên..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            <table className="table table-striped table-bordered mb-0">
                <thead>
                <tr>
                    <th style={{ width: '80px' }}>Ảnh</th>
                    <th>Tên</th>
                    <th>Mô tả</th>
                    <th>Giá</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {loading ? (
                    <tr>
                        <td colSpan="6" className="text-center">
                            Đang tải...
                        </td>
                    </tr>
                ) : paginatedProducts.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="text-center">
                            Không có sản phẩm nào
                        </td>
                    </tr>
                ) : (
                    paginatedProducts.map((p) => (
                        <tr key={p._id}>
                            <td>
                                {p.mainImage ? (
                                    <img
                                        src={p.mainImage}
                                        alt={p.name}
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            objectFit: 'cover',
                                        }}
                                    />
                                ) : (
                                    <span className="text-muted">Không có ảnh</span>
                                )}
                            </td>
                            <td>{p.name}</td>
                            <td>{p.description}</td>
                            <td>{p.price}</td>
                            <td>{p.hidden ? 'Đang ẩn' : 'Hiển thị'}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => navigate(`/products/edit/${p._id}`)}
                                >
                                    Sửa
                                </button>
                                <button
                                    className="btn btn-danger btn-sm me-2"
                                    onClick={() => handleDelete(p._id)}
                                >
                                    Xóa
                                </button>
                                <button
                                    className="btn btn-info btn-sm"
                                    onClick={() => toggleHidden(p)}
                                >
                                    {p.hidden ? 'Hiện' : 'Ẩn'}
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            {/* phân trang */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-2">
                    <button
                        className="btn btn-outline-primary me-2"
                        disabled={currentPage === 1}
                        onClick={handlePrev}
                    >
                        Trang trước
                    </button>
                    <span>
            Trang {currentPage}/{totalPages}
          </span>
                    <button
                        className="btn btn-outline-primary ms-2"
                        disabled={currentPage === totalPages}
                        onClick={handleNext}
                    >
                        Trang sau
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductList;
