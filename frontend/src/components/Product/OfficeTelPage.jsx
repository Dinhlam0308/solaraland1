import { useEffect, useState } from 'react';
import { getProductsByType, advancedFilterProducts } from '../../api/product';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/CanHoPage.css';

export default function OfficeTelPage() {
    const [products, setProducts] = useState([]);
    const [selectedBedrooms, setSelectedBedrooms] = useState([]);
    const [status, setStatus] = useState('sale');
    const [priceRange, setPriceRange] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // gọi dữ liệu office-tel
        getProductsByType('office-tel').then(data => setProducts(data));
    }, []);

    const handleCheckboxChange = (value) => {
        if (selectedBedrooms.includes(value)) {
            setSelectedBedrooms(selectedBedrooms.filter(v => v !== value));
        } else {
            setSelectedBedrooms([...selectedBedrooms, value]);
        }
    };

    const handleFilter = () => {
        let min = '';
        let max = '';

        if (status === 'sale') {
            if (priceRange === 'under2') {
                max = 2000000000;
            } else if (priceRange === 'under7') {
                max = 7000000000;
            } else if (priceRange === 'over7') {
                min = 7000000000;
            }
        } else {
            if (priceRange === 'under10m') {
                max = 10000000;
            } else if (priceRange === 'under20m') {
                max = 20000000;
            } else if (priceRange === 'over20m') {
                min = 20000000;
            }
        }

        const params = {
            type: 'office-tel',
            status,
            bedrooms: selectedBedrooms.join(','),
        };
        if (min) params.priceMin = min;
        if (max) params.priceMax = max;

        advancedFilterProducts(params).then(data => setProducts(data));
    };

    return (
        <div className="container-fluid p-4">
            <h1 className="h4 fw-bold mb-4 text-center">Office-tel</h1>

            <div className="row">
                {/* Bộ lọc bên trái */}
                <div className="col-md-3">
                    <div className="bg-light p-3 rounded sticky-top">
                        <h5 className="fw-bold mb-3">Bộ lọc</h5>

                        {/* Trạng thái */}
                        <div className="mb-3">
                            <label className="form-label d-block">Trạng thái</label>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="status"
                                    id="statusSale"
                                    value="sale"
                                    checked={status === 'sale'}
                                    onChange={e => {
                                        setStatus(e.target.value);
                                        setPriceRange('');
                                    }}
                                />
                                <label className="form-check-label" htmlFor="statusSale">Mua</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="status"
                                    id="statusRent"
                                    value="rent"
                                    checked={status === 'rent'}
                                    onChange={e => {
                                        setStatus(e.target.value);
                                        setPriceRange('');
                                    }}
                                />
                                <label className="form-check-label" htmlFor="statusRent">Thuê</label>
                            </div>
                        </div>

                        {/* Giá */}
                        <div className="mb-3">
                            <label className="form-label d-block">Giá</label>
                            {status === 'sale' ? (
                                <>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="priceRange"
                                            id="under2"
                                            value="under2"
                                            checked={priceRange === 'under2'}
                                            onChange={e => setPriceRange(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="under2">Dưới 2 tỷ</label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="priceRange"
                                            id="under7"
                                            value="under7"
                                            checked={priceRange === 'under7'}
                                            onChange={e => setPriceRange(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="under7">Dưới 7 tỷ</label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="priceRange"
                                            id="over7"
                                            value="over7"
                                            checked={priceRange === 'over7'}
                                            onChange={e => setPriceRange(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="over7">Trên 7 tỷ</label>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="priceRange"
                                            id="under10m"
                                            value="under10m"
                                            checked={priceRange === 'under10m'}
                                            onChange={e => setPriceRange(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="under10m">Dưới 10 triệu</label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="priceRange"
                                            id="under20m"
                                            value="under20m"
                                            checked={priceRange === 'under20m'}
                                            onChange={e => setPriceRange(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="under20m">Dưới 20 triệu</label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="priceRange"
                                            id="over20m"
                                            value="over20m"
                                            checked={priceRange === 'over20m'}
                                            onChange={e => setPriceRange(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="over20m">Trên 20 triệu</label>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Phòng ngủ */}
                        <div className="mb-3">
                            <label className="form-label d-block">Phòng ngủ</label>
                            {[1,2,3].map(n => (
                                <div className="form-check" key={n}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`bed${n}`}
                                        onChange={() => handleCheckboxChange(n)}
                                        checked={selectedBedrooms.includes(n)}
                                    />
                                    <label className="form-check-label" htmlFor={`bed${n}`}>{n}</label>
                                </div>
                            ))}
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="bedOther"
                                    onChange={() => handleCheckboxChange(0)}
                                    checked={selectedBedrooms.includes(0)}
                                />
                                <label className="form-check-label" htmlFor="bedOther">Khác</label>
                            </div>
                        </div>

                        <button className="btn btn-primary w-100" onClick={handleFilter}>Lọc</button>
                    </div>
                </div>

                {/* Danh sách sản phẩm bên phải */}
                <div className="col-md-9">
                    <div className="d-flex flex-wrap justify-content-start gap-4">
                        {products.map(product => (
                            <div
                                className="card-apartment"
                                key={product._id}
                                onClick={() => navigate(`/san-pham/${product.name}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img
                                    src={product.mainImage || '/placeholder.jpg'}
                                    alt={product.name}
                                />
                                <div className="overlay">
                                    <i className="bi bi-briefcase"></i> {/* icon đổi sang briefcase */}
                                </div>
                                <div className="info">
                                    <h6 className="mb-1">{product.name}</h6>
                                    <p className="mb-1 small">{product.price.toLocaleString()} đ</p>
                                    <a
                                        href={`https://zalo.me/0123456789`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-success btn-sm"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        Liên hệ Zalo
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
