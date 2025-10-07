"use client"

import { useEffect, useState } from "react"
import { getProductsByType, advancedFilterProducts } from "../../api/product"
import { getProjects } from "../../api/project"
import { useNavigate } from "react-router-dom"
import "../../assets/css/CanHoPage.css"

export default function NhaPhoPage() {
    const [products, setProducts] = useState([])
    const [selectedBedrooms, setSelectedBedrooms] = useState([])
    const [status, setStatus] = useState("")
    const [priceRange, setPriceRange] = useState("")
    const [projectsList, setProjectsList] = useState([])
    const [selectedProjects, setSelectedProjects] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        getProjects().then((res) => {
            const projectData = Array.isArray(res) ? res : res.data || []
            setProjectsList(projectData)
        })
        getProductsByType("nha-pho").then((data) => setProducts(data))
    }, [])

    const handleCheckboxChange = (value) => {
        setSelectedBedrooms((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        )
    }

    const handleProjectChange = (id) => {
        setSelectedProjects((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        )
    }

    const handleFilter = () => {
        let min = ""
        let max = ""

        if (status === "sale") {
            if (priceRange === "under2") max = 2000000000
            else if (priceRange === "under7") max = 7000000000
            else if (priceRange === "over7") min = 7000000000
        } else if (status === "rent") {
            if (priceRange === "under10m") max = 10000000
            else if (priceRange === "under20m") max = 20000000
            else if (priceRange === "over20m") min = 20000000
        }

        const params = {
            type: "nha-pho",
        }
        if (status) params.status = status
        if (selectedBedrooms.length > 0)
            params.bedrooms = selectedBedrooms.join(",")
        if (selectedProjects.length > 0)
            params.projectId = selectedProjects.join(",")
        if (min) params.priceMin = min
        if (max) params.priceMax = max

        advancedFilterProducts(params).then((data) => setProducts(data))
    }

    return (
        <div className="container-fluid p-4">
            <h1 className="h4 fw-bold mb-4 text-center">Nhà phố</h1>

            <div className="row">
                {/* BỘ LỌC */}
                <div className="col-md-3">
                    <div className="bg-light p-3 rounded sticky-top">
                        <h5 className="fw-bold mb-3">Bộ lọc</h5>

                        {/* 🔹 Dự án */}
                        <div className="mb-3">
                            <label className="form-label d-block">Dự án</label>
                            {projectsList.length === 0 && (
                                <p className="text-muted small">Không có dự án</p>
                            )}
                            {projectsList.map((proj) => (
                                <div className="form-check" key={proj._id}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`proj${proj._id}`}
                                        checked={selectedProjects.includes(proj._id)}
                                        onChange={() => handleProjectChange(proj._id)}
                                    />
                                    <label
                                        className="form-check-label ms-2"
                                        htmlFor={`proj${proj._id}`}
                                    >
                                        {proj.name}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* 🔹 Trạng thái */}
                        <div className="mb-3">
                            <label className="form-label d-block">Trạng thái</label>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="status"
                                    id="statusSale"
                                    value="sale"
                                    checked={status === "sale"}
                                    onChange={(e) => {
                                        setStatus(e.target.value)
                                        setPriceRange("")
                                    }}
                                />
                                <label className="form-check-label" htmlFor="statusSale">
                                    Mua
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="status"
                                    id="statusRent"
                                    value="rent"
                                    checked={status === "rent"}
                                    onChange={(e) => {
                                        setStatus(e.target.value)
                                        setPriceRange("")
                                    }}
                                />
                                <label className="form-check-label" htmlFor="statusRent">
                                    Thuê
                                </label>
                            </div>
                        </div>

                        {/* 🔹 Giá */}
                        <div className="mb-3">
                            <label className="form-label d-block">Giá</label>
                            {status === "sale" ? (
                                <>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="priceRange" id="under2" value="under2"
                                               checked={priceRange === "under2"} onChange={(e) => setPriceRange(e.target.value)} />
                                        <label className="form-check-label" htmlFor="under2">Dưới 2 tỷ</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="priceRange" id="under7" value="under7"
                                               checked={priceRange === "under7"} onChange={(e) => setPriceRange(e.target.value)} />
                                        <label className="form-check-label" htmlFor="under7">Dưới 7 tỷ</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="priceRange" id="over7" value="over7"
                                               checked={priceRange === "over7"} onChange={(e) => setPriceRange(e.target.value)} />
                                        <label className="form-check-label" htmlFor="over7">Trên 7 tỷ</label>
                                    </div>
                                </>
                            ) : status === "rent" ? (
                                <>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="priceRange" id="under10m" value="under10m"
                                               checked={priceRange === "under10m"} onChange={(e) => setPriceRange(e.target.value)} />
                                        <label className="form-check-label" htmlFor="under10m">Dưới 10 triệu</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="priceRange" id="under20m" value="under20m"
                                               checked={priceRange === "under20m"} onChange={(e) => setPriceRange(e.target.value)} />
                                        <label className="form-check-label" htmlFor="under20m">Dưới 20 triệu</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="priceRange" id="over20m" value="over20m"
                                               checked={priceRange === "over20m"} onChange={(e) => setPriceRange(e.target.value)} />
                                        <label className="form-check-label" htmlFor="over20m">Trên 20 triệu</label>
                                    </div>
                                </>
                            ) : (
                                <p className="text-muted small">(Chọn Mua/Thuê để lọc giá)</p>
                            )}
                        </div>

                        {/* 🔹 Phòng ngủ */}
                        <div className="mb-3">
                            <label className="form-label d-block">Phòng ngủ</label>
                            {[1, 2, 3].map((n) => (
                                <div className="form-check" key={n}>
                                    <input className="form-check-input" type="checkbox" id={`bed${n}`}
                                           onChange={() => handleCheckboxChange(n)}
                                           checked={selectedBedrooms.includes(n)} />
                                    <label className="form-check-label" htmlFor={`bed${n}`}>{n}</label>
                                </div>
                            ))}
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="bedOther"
                                       onChange={() => handleCheckboxChange(0)}
                                       checked={selectedBedrooms.includes(0)} />
                                <label className="form-check-label" htmlFor="bedOther">Khác</label>
                            </div>
                        </div>

                        <button className="btn btn-primary w-100" onClick={handleFilter}>Lọc</button>
                    </div>
                </div>

                {/* DANH SÁCH */}
                <div className="col-md-9">
                    <div className="d-flex flex-wrap justify-content-start gap-4">
                        {products.map((product) => (
                            <div className="card-apartment" key={product._id}
                                 onClick={() => navigate(`/san-pham/${product.name}`)}
                                 style={{ cursor: "pointer" }}>
                                <img src={product.mainImage || "/placeholder.jpg"} alt={product.name} />
                                <div className="overlay"><i className="bi bi-building"></i></div>
                                <div className="info">
                                    <h6 className="mb-1">{product.name}</h6>
                                    <p className="mb-1 small">{Number(product.price).toLocaleString()} đ</p>
                                    <a href={`https://zalo.me/0123456789`} target="_blank" rel="noopener noreferrer"
                                       className="btn btn-success btn-sm" onClick={(e) => e.stopPropagation()}>
                                        Liên hệ Zalo
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
