import React, { useEffect, useState } from 'react';
import { getProduct, updateProduct } from '../../api/product';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/api';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        price: '',
        bedrooms: '',
        description: '',
        type: 'can-ho',
        project: '',
        status: 'sale',
        hidden: false,
    });

    const [projects, setProjects] = useState([]);

    // ảnh hiện có
    const [currentMainImage, setCurrentMainImage] = useState(null);
    const [currentSubImages, setCurrentSubImages] = useState([]);

    // ảnh mới
    const [mainImage, setMainImage] = useState(null);
    const [subImages, setSubImages] = useState([]);

    // Lấy danh sách dự án
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/api/projects');
                let arr = [];
                if (Array.isArray(res.data)) {
                    arr = res.data;
                } else if (Array.isArray(res.data.projects)) {
                    arr = res.data.projects;
                } else if (Array.isArray(res.data.data)) {
                    arr = res.data.data;
                } else if (Array.isArray(res.data.data?.projects)) {
                    arr = res.data.data.projects;
                }
                setProjects(arr);
            } catch (err) {
                console.error('Lỗi tải dự án', err);
                setProjects([]);
            }
        };
        fetchProjects();
    }, []);

    // Lấy sản phẩm theo id
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProduct(id);
                const productData = data && data.data ? data.data : data;

                setForm({
                    name: productData.name || '',
                    price: productData.price || '',
                    bedrooms: productData.bedrooms || '',
                    description: productData.description || '',
                    type: productData.type || 'can-ho',
                    // nếu project là object thì lấy _id
                    project:
                        typeof productData.project === 'object'
                            ? productData.project._id
                            : productData.project || '',
                    status: productData.status || 'sale',
                    hidden: productData.hidden || false,
                });

                // ảnh hiện có
                setCurrentMainImage(productData.mainImage || null);
                setCurrentSubImages(productData.subImages || []);
            } catch (err) {
                console.error('Lỗi tải sản phẩm', err);
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    const handleMainImageChange = (e) => {
        setMainImage(e.target.files[0]);
    };

    const handleSubImagesChange = (e) => {
        setSubImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in form) {
            data.append(key, form[key]);
        }
        if (mainImage) {
            data.append('mainImage', mainImage);
        }
        if (subImages.length > 0) {
            for (let i = 0; i < subImages.length; i++) {
                data.append('subImages', subImages[i]);
            }
        }

        try {
            await updateProduct(id, data);
            navigate('/products');
        } catch (err) {
            console.error('Lỗi cập nhật sản phẩm', err);
        }
    };
    const handleDeleteSubImage = async (imgUrl) => {
        if (window.confirm('Bạn có chắc muốn xóa ảnh này?')) {
            try {
                await api.delete(`/api/products/${id}/subimage`, {
                    data: { imageUrl: imgUrl },
                });
                // cập nhật state sau khi xóa
                setCurrentSubImages((prev) => prev.filter((img) => img !== imgUrl));
            } catch (err) {
                console.error('Lỗi xóa ảnh phụ', err);
            }
        }
    };


    return (
        <div className="container mt-4">
            <h2 className="mb-3">Sửa sản phẩm</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Tên sản phẩm"
                        value={form.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="number"
                        name="price"
                        className="form-control"
                        placeholder="Giá"
                        value={form.price}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="number"
                        name="bedrooms"
                        className="form-control"
                        placeholder="Số phòng ngủ"
                        value={form.bedrooms}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
          <textarea
              name="description"
              className="form-control"
              placeholder="Mô tả"
              value={form.description}
              onChange={handleChange}
          />
                </div>

                <div className="mb-3">
                    <label>Loại:</label>
                    <select name="type" className="form-select" value={form.type} onChange={handleChange}>
                        <option value="can-ho">Căn hộ</option>
                        <option value="nha-pho">Nhà phố</option>
                        <option value="office-tel">Office-tel</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label>Dự án:</label>
                    <select name="project" className="form-select" value={form.project} onChange={handleChange}>
                        <option value="">-- Chọn dự án --</option>
                        {Array.isArray(projects) &&
                            projects.map((proj) => (
                                <option key={proj._id} value={proj._id}>
                                    {proj.name}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label>Trạng thái:</label>
                    <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                        <option value="sale">Bán</option>
                        <option value="rent">Cho thuê</option>
                    </select>
                </div>

                <div className="form-check mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name="hidden"
                        checked={form.hidden}
                        onChange={handleChange}
                        id="hiddenCheck"
                    />
                    <label className="form-check-label" htmlFor="hiddenCheck">
                        Ẩn sản phẩm
                    </label>
                </div>

                {/* Ảnh hiện có */}
                <div className="mb-3">
                    <label>Ảnh chính hiện tại:</label><br/>
                    {currentMainImage ? (
                        <img
                            src={currentMainImage}
                            alt="Ảnh chính"
                            style={{width: '120px', height: '120px', objectFit: 'cover'}}
                        />
                    ) : (
                        <span className="text-muted">Không có ảnh</span>
                    )}
                </div>

                <div className="mb-3">
                    <label>Ảnh phụ hiện tại:</label><br/>
                    {currentSubImages && currentSubImages.length > 0 ? (
                        currentSubImages.map((img, i) => (
                            <div key={i} style={{display: 'inline-block', marginRight: '10px', textAlign: 'center'}}>
                                <img
                                    src={img}
                                    alt={`Ảnh phụ ${i}`}
                                    style={{width: '80px', height: '80px', objectFit: 'cover'}}
                                />
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger mt-1"
                                    onClick={() => handleDeleteSubImage(img)}
                                >
                                    Xóa
                                </button>
                            </div>
                        ))
                    ) : (
                        <span className="text-muted">Không có ảnh</span>
                    )}
                </div>


                {/* Ảnh mới */}
                <div className="mb-3">
                    <label>Ảnh chính mới (nếu muốn thay):</label>
                    <input type="file" name="mainImage" className="form-control" onChange={handleMainImageChange}/>
                </div>

                <div className="mb-3">
                    <label>Ảnh phụ mới (nếu muốn thay):</label>
                    <input type="file" name="subImages" className="form-control" multiple
                           onChange={handleSubImagesChange}/>
                </div>

                <button type="submit" className="btn btn-primary me-2">
                    Lưu
                </button>
                <button type="button" onClick={() => navigate('/products')} className="btn btn-secondary">
                    Quay lại trang sản phẩm
                </button>
            </form>
        </div>
    );
};

export default EditProduct;
