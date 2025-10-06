"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getNewsList } from "../../api/news"
import "../../assets/css/NewsPage.css"

export default function NewsListPage() {
    const [news, setNews] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10

    useEffect(() => {
        async function fetchNews() {
            try {
                const data = await getNewsList()
                setNews(data)
            } catch (error) {
                console.error("Lỗi lấy danh sách tin tức:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchNews()
    }, [])

    if (loading) return <p>Đang tải tin tức...</p>

    const filteredNews = news.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))

    const totalPages = Math.ceil(filteredNews.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const currentNews = filteredNews.slice(startIndex, startIndex + pageSize)

    return (
        <div className="news-list-container">
            <div className="news-search-wrapper">
                <input
                    type="text"
                    placeholder="Tìm kiếm tin tức..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setCurrentPage(1)
                    }}
                    className="news-search-input"
                />
            </div>

            <div className="news-grid">
                {currentNews.map((item, index) => (
                    <div key={item._id ?? index} className="news-card">
                        <Link to={`/tin-tuc/${item.slug}`} className="news-card-link">
                            {item.thumbnail && (
                                <img src={item.thumbnail || "/placeholder.svg"} alt={item.title} className="news-thumbnail" />
                            )}
                            <div className="news-card-content">
                                <h3 className="news-title">{item.title}</h3>
                                <p className="news-description">
                                    {item.metaDescription
                                        ? item.metaDescription.slice(0, 100) + (item.metaDescription.length > 100 ? "…" : "")
                                        : item.content
                                            ? item.content.replace(/<[^>]+>/g, "").slice(0, 100) + "…"
                                            : ""}
                                </p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="news-pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`pagination-button ${page === currentPage ? "active" : ""}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}