import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../assets/css/HomePage.css";
import bannerVideo from "../../assets/video/banner.mp4";
import Slider from "react-slick";
import { getProductsForRent } from "../../api/product";
import { FaHome, FaTimes } from "react-icons/fa";

const projects = [
    { slug: "sunrise-riverside", name: "Sunrise Riverside", img: "/images/trangchu_SunriseRiverside.jpg", alt: "Dự án Sunrise Riverside" },
    { slug: "saigon-south", name: "Saigon South", img: "/images/trangchu_SaiGonSouth.jpg", alt: "Dự án Saigon South" },
    { slug: "celesta-rise", name: "Celesta Rise", img: "/images/trangchu_CelestaRise.jpg", alt: "Dự án Celesta Rise" },
    { slug: "lavida-plus", name: "Lavida Plus", img: "/images/trangchu_Lavidaplus.png", alt: "Dự án Lavida Plus" },
    { slug: "zeitgeist", name: "Zeitgeist", img: "/images/trangchu_Zeitgeist.png", alt: "Dự án Zeitgeist" },
    { slug: "victoria-village", name: "Victoria Village", img: "/images/trangchu_VictoriaVillage.jpg", alt: "Dự án Victoria Village" },
];

const PrevArrow = ({ onClick }) => (
    <div className="custom-arrow custom-prev" onClick={onClick}>
        <span>&#10094;</span>
    </div>
);

const NextArrow = ({ onClick }) => (
    <div className="custom-arrow custom-next" onClick={onClick}>
        <span>&#10095;</span>
    </div>
);

const Home = () => {
    const [rentProducts, setRentProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [zoomImage, setZoomImage] = useState(null);

    useEffect(() => {
        getProductsForRent().then((data) => {
            const mapped = data.map((p) => ({
                ...p,
                mainImage: p.mainImage ? `${p.mainImage}` : "",
                images:
                    p.subImages && p.subImages.length > 0
                        ? [p.mainImage, ...p.subImages]
                        : [p.mainImage],
            }));
            setRentProducts(mapped.slice(0, 10));
        });
    }, []);

    // ✅ Slider responsive chuẩn
    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        responsive: [
            {
                breakpoint: 1200, // laptop
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    arrows: false,
                },
            },
            {
                breakpoint: 992, // tablet
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows: false,
                },
            },
            {
                breakpoint: 768, // ✅ mobile
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: true,
                    centerMode: true,
                    centerPadding: "0px",
                },
            },
        ],
    };

    // ✅ Bắt slick cập nhật sau khi load (fix trường hợp không nhận breakpoint mobile)
    useEffect(() => {
        const handleResize = () => {
            window.dispatchEvent(new Event("resize"));
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            {/* ===== Banner ===== */}
            <div className="banner">
                <video autoPlay muted loop playsInline>
                    <source src={bannerVideo} type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ video.
                </video>
                <div className="overlay"></div>
                <div className="banner-content">
                    <h1>Solaraland</h1>
                    <p>Bất động sản xanh, sinh lời bền vững</p>
                </div>
            </div>

            {/* ===== DỰ ÁN ===== */}
            <div className="selection-title">
                <h2>DỰ ÁN ĐANG BÁN</h2>
            </div>
            <div className="du-an-dang-ban">
                {projects.map((project) => (
                    <Link to={`/trang-chu/${project.slug}`} key={project.slug}>
                        <div className="project-card">
                            <img src={project.img} alt={project.alt} title={project.alt} />
                            <div className="project-name">{project.name}</div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* ===== CĂN HỘ CHO THUÊ ===== */}
            <div className="selection-title">
                <h2>CĂN HỘ CHO THUÊ</h2>
            </div>
            <div className="rent-slider-container">
                <Slider {...sliderSettings}>
                    {rentProducts.map((item) => (
                        <div key={item._id} className="slide-wrapper">
                            <div className="rent-card">
                                <div
                                    className="rent-img-wrapper"
                                    onClick={() => {
                                        setSelectedProduct(item);
                                        setActiveImage(item.mainImage);
                                    }}
                                >
                                    <img src={item.mainImage} alt={item.name} className="rent-img" />
                                    <div className="rent-overlay">
                                        <FaHome size={28} style={{ marginBottom: "6px" }} />
                                        <span>Quick View</span>
                                    </div>
                                </div>
                                <div className="rent-info">
                                    <h3>{item.name}</h3>
                                    <p className="rent-price">{item.price?.toLocaleString()} VND/tháng</p>
                                    <button
                                        className="contact-btn"
                                        onClick={() => window.open(`https://zalo.me/so-zalo`, "_blank")}
                                    >
                                        Liên hệ
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* ===== MODAL QUICK VIEW ===== */}
            {selectedProduct && (
                <div className="quickview-modal">
                    <div className="quickview-content">
                        <button className="quickview-close" onClick={() => setSelectedProduct(null)}>
                            <FaTimes />
                        </button>
                        <div className="quickview-left">
                            <div className="quickview-image-container">
                                <img
                                    src={activeImage}
                                    alt={selectedProduct.name}
                                    className="quickview-image"
                                    onClick={() => setZoomImage(activeImage)}
                                />
                            </div>
                            <div className="quickview-thumbs">
                                {selectedProduct.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt=""
                                        className={activeImage === img ? "active" : ""}
                                        onClick={() => setActiveImage(img)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="quickview-right">
                            <h3>{selectedProduct.name}</h3>
                            <p className="rent-price">{selectedProduct.price?.toLocaleString()} VND/tháng</p>
                            <p>{selectedProduct.description || "Mô tả sản phẩm..."}</p>
                            <button
                                className="contact-btn"
                                onClick={() => window.open(`https://zalo.me/so-zalo`, "_blank")}
                            >
                                Liên hệ qua Zalo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== MODAL ZOOM ===== */}
            {zoomImage && (
                <div className="zoom-modal" onClick={() => setZoomImage(null)}>
                    <button className="zoom-close" onClick={() => setZoomImage(null)}>
                        <FaTimes />
                    </button>
                    <img src={zoomImage} alt="Zoom" className="zoomed-image" />
                </div>
            )}
        </>
    );
};

export default Home;
