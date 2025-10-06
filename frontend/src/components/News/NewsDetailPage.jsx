// src/NewsDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNewsBySlug } from '../../api/news';

export default function NewsDetailPage() {
    const { slug } = useParams();
    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchNewsDetail() {
            try {
                const data = await getNewsBySlug(slug);
                setNewsItem(data);
            } catch (error) {
                console.error('Lỗi lấy chi tiết tin tức:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchNewsDetail();
        // mỗi lần load chi tiết thì cuộn lên đầu trang
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) return <p>Đang tải chi tiết tin tức...</p>;
    if (!newsItem) return <p>Không tìm thấy tin tức</p>;

    return (
        <div>
            {/* Hero image với overlay title */}
            {newsItem.thumbnail && (
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        maxHeight: '500px',
                        overflow: 'hidden',
                    }}
                >
                    <img
                        src={newsItem.thumbnail}
                        alt={newsItem.title}
                        style={{
                            width: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(60%)', // làm tối ảnh nhẹ để chữ nổi bật
                            maxHeight: '500px'
                        }}
                    />
                    <h1
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#fff',
                            fontSize: '2.5rem',
                            textAlign: 'center',
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}
                    >
                        {newsItem.title}
                    </h1>
                </div>
            )}

            {/* ngày đăng */}
            <div style={{ maxWidth: '800px', margin: '20px auto', padding: '0 15px' }}>
                <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                    Ngày đăng: {new Date(newsItem.createdAt).toLocaleDateString('vi-VN')}
                </p>
            </div>

            {/* Nội dung */}
            <div
                style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    padding: '0 15px',
                    lineHeight: '1.8',
                    textAlign: 'justify'
                }}
                dangerouslySetInnerHTML={{ __html: newsItem.content }}
            />

            {/* Nút quay lại danh sách */}
            <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 15px', textAlign: 'center' }}>
                <button
                    onClick={() => {
                        navigate('/tin-tuc'); // quay về trang tin tức
                        window.scrollTo(0, 0); // cuộn về đầu trang danh sách tin
                    }}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    ← Quay lại danh sách tin tức
                </button>
            </div>

            {/* Nút quay lên đầu trang dạng tròn */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                    fontSize: '24px',
                    zIndex: 1000
                }}
                aria-label="Quay lên đầu trang"
            >
                ↑
            </button>
        </div>
    );
}
