import { useEffect, useState } from "react";
import { getProjectWithSaleProducts } from "../../api/product";
import { useNavigate, Link } from "react-router-dom";
import "../../assets/css/sunriseriverside.css";

function getThumbnail(url, width = 300, height = 300) {
    if (!url) return "";
    if (!url.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", `/upload/w_${width},h_${height},c_limit/`);
}

export default function CelestaRisePage() {
    const celestaProjectId = "68e31756e114ddee507232d4";
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [projectInfo, setProjectInfo] = useState(null);

    // bộ lọc
    const [priceRange, setPriceRange] = useState(null);
    const [bedrooms, setBedrooms] = useState([]);
    const [types, setTypes] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;
    const navigate = useNavigate();
    const zaloNumber = "0968992882";

    useEffect(() => {
        getProjectWithSaleProducts(celestaProjectId).then((data) => {
            setAllProducts(data.products || []);
            setProducts(data.products || []);
            setProjectInfo(data.project || null);
        });
    }, [celestaProjectId]);

    // áp dụng bộ lọc
    useEffect(() => {
        let filtered = [...allProducts];

        if (priceRange) {
            const [min, max] = priceRange;
            filtered = filtered.filter(
                (p) => (!min || p.price >= min) && (!max || p.price <= max)
            );
        }

        if (bedrooms.length > 0) {
            filtered = filtered.filter((p) => bedrooms.includes(String(p.bedrooms)));
        }

        if (types.length > 0) {
            filtered = filtered.filter((p) => types.includes(p.type));
        }

        setProducts(filtered);
        setCurrentPage(1);
    }, [priceRange, bedrooms, types, allProducts]);

    // phân trang
    const indexOfLast = currentPage * productsPerPage;
    const indexOfFirst = indexOfLast - productsPerPage;
    const currentProducts = products.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(products.length / productsPerPage);

    // toggle checkbox
    const toggle = (value, list, setList) => {
        if (list.includes(value)) {
            setList(list.filter((v) => v !== value));
        } else {
            setList([...list, value]);
        }
    };

    // Nếu DB không có sản phẩm nào:
    if (allProducts.length === 0 && projectInfo) {
        return (
            <div className="sunrise-container">
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <h2 className="text-xl font-semibold">{projectInfo.name}</h2>
                    <div
                        className="mt-2 text-gray-700"
                        dangerouslySetInnerHTML={{ __html: projectInfo.description }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div
            className="sunrise-page"
            style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}
        >
            {/* Sidebar bên trái */}
            {allProducts.length > 0 && (
                <aside
                    style={{
                        width: "250px",
                        border: "1px solid #ddd",
                        padding: "1rem",
                        borderRadius: "8px",
                        backgroundColor: "#fff",
                        flexShrink: 0,
                        marginTop: "70px",
                    }}
                >
                    <h3 style={{ marginBottom: "10px" }}>Bộ lọc</h3>

                    <div style={{ marginBottom: "1rem" }}>
                        <strong>Khoảng giá</strong>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="price"
                                    onChange={() => setPriceRange([0, 2000000000])}
                                />{" "}
                                Dưới 2 tỷ
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="price"
                                    onChange={() => setPriceRange([2000000000, 5000000000])}
                                />{" "}
                                2-5 tỷ
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="price"
                                    onChange={() => setPriceRange([5000000000, null])}
                                />{" "}
                                Trên 5 tỷ
                            </label>
                        </div>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <strong>Số phòng</strong>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={bedrooms.includes("1")}
                                    onChange={() => toggle("1", bedrooms, setBedrooms)}
                                />{" "}
                                1 phòng
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={bedrooms.includes("2")}
                                    onChange={() => toggle("2", bedrooms, setBedrooms)}
                                />{" "}
                                2 phòng
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={bedrooms.includes("3")}
                                    onChange={() => toggle("3", bedrooms, setBedrooms)}
                                />{" "}
                                3 phòng
                            </label>
                        </div>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <strong>Loại căn hộ</strong>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={types.includes("can-ho")}
                                    onChange={() => toggle("can-ho", types, setTypes)}
                                />{" "}
                                Căn hộ
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={types.includes("nha-pho")}
                                    onChange={() => toggle("nha-pho", types, setTypes)}
                                />{" "}
                                Nhà phố
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={types.includes("office-tel")}
                                    onChange={() => toggle("office-tel", types, setTypes)}
                                />{" "}
                                Office-tel
                            </label>
                        </div>
                    </div>
                </aside>
            )}

            {/* Nội dung bên phải */}
            <div className="sunrise-container" style={{ flex: 1 }}>
                {/* Nếu lọc không ra sản phẩm */}
                {allProducts.length > 0 && products.length === 0 && (
                    <div style={{ textAlign: "center", marginTop: "1rem" }}>
                        Không có sản phẩm phù hợp
                    </div>
                )}

                {/* Nếu có sản phẩm */}
                {products.length > 0 && (
                    <>
                        <h1 className="sunrise-title">Celesta Rise</h1>

                        <nav
                            style={{
                                fontSize: "0.875rem",
                                marginBottom: "1rem",
                                textAlign: "left",
                            }}
                        >
                            <Link to="/" style={{ color: "#646cff", textDecoration: "none" }}>
                                Trang chủ
                            </Link>{" "}
                            &gt; <span>Celesta Rise</span>
                        </nav>

                        {/* Grid sản phẩm */}
                        {currentProducts.length > 0 && (
                            <div className="sunrise-grid">
                                {currentProducts.map((prod) => (
                                    <div key={prod._id} className="sunrise-card">
                                        <div
                                            className="sunrise-image-wrapper"
                                            onClick={() => navigate(`/san-pham/${prod.name}`)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <img
                                                src={getThumbnail(prod.mainImage, 350, 350)}
                                                alt={prod.name}
                                                className="sunrise-image"
                                            />
                                        </div>

                                        <div className="sunrise-info">
                                            <h3 className="sunrise-name">
                                                {prod.name || "Không có tên"}
                                            </h3>
                                            {prod.price && (
                                                <p className="sunrise-price">
                                                    {Number(prod.price).toLocaleString("vi-VN")} VND
                                                </p>
                                            )}
                                            <a
                                                href={`https://zalo.me/${zaloNumber}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    marginTop: "8px",
                                                    padding: "6px 12px",
                                                    borderRadius: "4px",
                                                    backgroundColor: "#0084ff",
                                                    color: "#fff",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    textDecoration: "none",
                                                    display: "inline-block",
                                                }}
                                            >
                                                Liên hệ Zalo
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* phân trang */}
                        {totalPages > 1 && (
                            <div
                                style={{
                                    marginTop: "1rem",
                                    display: "flex",
                                    gap: "8px",
                                    justifyContent: "center",
                                }}
                            >
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                    (page) => (
                                        <button
                                            key={page}
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: "4px",
                                                backgroundColor:
                                                    currentPage === page ? "#646cff" : "#f3f4f6",
                                                color: currentPage === page ? "#fff" : "#000",
                                                border: "none",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
