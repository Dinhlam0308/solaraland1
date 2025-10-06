"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getProductByName } from "../../api/product.js"
import { Container, Row, Col, Button } from "react-bootstrap"
import "../../assets/css/ProductDetail.css"

export default function ProductDetail() {
    const { name } = useParams()
    const [product, setProduct] = useState(null)

    const [currentIndex, setCurrentIndex] = useState(0)
    const zaloNumber = "0123456789"

    useEffect(() => {
        async function fetchData() {
            const prod = await getProductByName(name)
            setProduct(prod)
            setCurrentIndex(0)
        }
        fetchData()
    }, [name])

    if (!product) return <div className="text-center my-5">Đang tải...</div>

    // Gom ảnh chính + ảnh phụ thành 1 mảng để duyệt
    const images = [...(product.mainImage ? [product.mainImage] : []), ...(product.subImages || [])]

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                {/* Cột ảnh bên trái */}
                <Col md={6} className="text-center">
                    <div className="position-relative">
                        <img
                            src={images[currentIndex]}
                            alt="main"
                            className="img-fluid rounded shadow-sm mb-2"
                            style={{ maxHeight: "400px", objectFit: "cover" }}
                        />
                        {/* nút chuyển ảnh */}
                        <Button
                            variant="light"
                            className="position-absolute top-50 start-0 translate-middle-y"
                            style={{ opacity: 0.7 }}
                            onClick={handlePrev}
                        >
                            &lt;
                        </Button>
                        <Button
                            variant="light"
                            className="position-absolute top-50 end-0 translate-middle-y"
                            style={{ opacity: 0.7 }}
                            onClick={handleNext}
                        >
                            &gt;
                        </Button>
                    </div>

                    {/* thumbnails */}
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "3px",
                            justifyContent: "center",
                        }}
                    >
                        {images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`thumb-${idx}`}
                                onClick={() => setCurrentIndex(idx)}
                                className={`rounded shadow-sm ${currentIndex === idx ? "border border-primary" : ""}`}
                                style={{
                                    height: "70px",
                                    width: "70px",
                                    objectFit: "cover",
                                    cursor: "pointer",
                                }}
                            />
                        ))}
                    </div>
                </Col>

                {/* Cột thông tin bên phải */}
                <Col md={6}>
                    <h1 className="mb-3">{product.name}</h1>
                    <p className="text-muted">{product.description}</p>

                    {product.price && <h4 className="text-primary">Giá: {Number(product.price).toLocaleString("vi-VN")} VND</h4>}

                    {/* Nút liên hệ Zalo */}
                    <div className="mt-3 mb-4">
                        <a
                            href={`https://zalo.me/${zaloNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success btn-lg"
                        >
                            Liên hệ Zalo
                        </a>
                    </div>
                </Col>
            </Row>

            {/* Thông tin dự án bên dưới */}
            {product.project && (
                <div className="mt-5 text-center">
                    <h2 className="mb-3">Thông tin dự án</h2>
                    <h4>{product.project.name}</h4>
                    <div
                        className="mx-auto"
                        style={{ maxWidth: "800px", textAlign: "justify" }}
                        dangerouslySetInnerHTML={{ __html: product.project.description }}
                    />
                    {product.project.thumbnail && (
                        <img
                            src={product.project.thumbnail}
                            alt={product.project.name}
                            className="img-fluid rounded shadow-sm mt-3"
                            style={{ maxHeight: "300px", objectFit: "cover" }}
                        />
                    )}
                </div>
            )}
        </Container>
    )
}
