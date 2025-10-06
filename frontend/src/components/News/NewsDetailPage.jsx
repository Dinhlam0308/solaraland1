"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getNewsBySlug } from "../../api/news"
import "../../assets/css/NewsDetail.css"

export default function NewsDetailPage() {
    const { slug } = useParams()
    const [newsItem, setNewsItem] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchNewsDetail() {
            try {
                const data = await getNewsBySlug(slug)
                setNewsItem(data)
            } catch (error) {
                console.error("Lỗi lấy chi tiết tin tức:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchNewsDetail()
        window.scrollTo(0, 0)
    }, [slug])

    if (loading) return <p>Đang tải chi tiết tin tức...</p>
    if (!newsItem) return <p>Không tìm thấy tin tức</p>

    return (
        <div>
            {newsItem.thumbnail && (
                <div className="news-detail-hero">
                    <img src={newsItem.thumbnail || "/placeholder.svg"} alt={newsItem.title} className="news-detail-hero-image" />
                    <h1 className="news-detail-title">{newsItem.title}</h1>
                </div>
            )}

            <div className="news-detail-date">
                <p>Ngày đăng: {new Date(newsItem.createdAt).toLocaleDateString("vi-VN")}</p>
            </div>

            <div className="news-detail-content" dangerouslySetInnerHTML={{ __html: newsItem.content }} />

            <div className="news-back-button-wrapper">
                <button
                    onClick={() => {
                        navigate("/tin-tuc")
                        window.scrollTo(0, 0)
                    }}
                    className="news-back-button"
                >
                    ← Quay lại danh sách tin tức
                </button>
            </div>

            <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="scroll-to-top-button"
                aria-label="Quay lên đầu trang"
            >
                ↑
            </button>
        </div>
    )
}
