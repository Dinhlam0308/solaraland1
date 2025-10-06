import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNewsList } from '../../api/news';

export default function NewsListPage() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // 1 trang 10 tin

    useEffect(() => {
        async function fetchNews() {
            try {
                const data = await getNewsList();
                setNews(data);
            } catch (error) {
                console.error('Lỗi lấy danh sách tin tức:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchNews();
    }, []);

    if (loading) return <p>Đang tải tin tức...</p>;

    // Lọc theo ô tìm kiếm
    const filteredNews = news.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    // Tính tổng số trang
    const totalPages = Math.ceil(filteredNews.length / pageSize);

    // Lấy danh sách tin cho trang hiện tại
    const startIndex = (currentPage - 1) * pageSize;
    const currentNews = filteredNews.slice(startIndex, startIndex + pageSize);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* ô tìm kiếm */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <input
                    type="text"
                    placeholder="Tìm kiếm tin tức..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1); // reset về trang 1 khi tìm kiếm
                    }}
                    style={{
                        padding: '10px 14px',
                        width: '280px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        backgroundColor: '#fff',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // bóng đổ nhẹ
                        fontSize: '1rem',
                        outline: 'none'
                    }}
                />
            </div>

            {/* grid danh sách tin */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)', // 3 cột
                    gap: '20px',
                }}
            >
                {currentNews.map((item, index) => (
                    <div
                        key={item._id ?? index}
                        style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            textAlign: 'center',
                            padding: '10px',
                        }}
                    >
                        <Link
                            to={`/tin-tuc/${item.slug}`} // đường dẫn chi tiết mới
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            {item.thumbnail && (
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    style={{
                                        width: '100%',
                                        aspectRatio: '16/9', // tỷ lệ ảnh ngang chuẩn 16:9
                                        objectFit: 'cover', // tự căn chỉnh ảnh
                                        borderRadius: '6px',
                                    }}
                                />
                            )}
                            <h3 style={{ marginTop: '10px', fontSize: '1.1rem' }}>{item.title}</h3>
                            <p style={{ color: '#555' }}>
                                {item.metaDescription
                                    ? item.metaDescription.slice(0, 100) +
                                    (item.metaDescription.length > 100 ? '…' : '')
                                    : item.content
                                        ? item.content.replace(/<[^>]+>/g, '').slice(0, 100) + '…'
                                        : ''}
                            </p>
                        </Link>
                    </div>
                ))}
            </div>

            {/* phân trang */}
            {totalPages > 1 && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            style={{
                                margin: '0 5px',
                                padding: '6px 12px',
                                backgroundColor: page === currentPage ? '#007bff' : '#f0f0f0',
                                color: page === currentPage ? '#fff' : '#000',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
