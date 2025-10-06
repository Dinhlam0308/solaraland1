import React, { useState, useEffect } from 'react';
import { createProduct } from '../../api/product';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/api'; // axios instance để gọi API dự án

const CreateProduct = ({ onBack }) => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        price: '',
        bedrooms: '',
        description: '',
        type: 'can-ho',
        project: '',
        status: 'sale',
    });
    const [projects, setProjects] = useState([]);
    const [mainImage, setMainImage] = useState(null);
    const [subImages, setSubImages] = useState([]);

    // Lấy danh sách dự án
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/api/projects');
                // chuẩn hóa để luôn ra mảng
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
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
            await createProduct(data);
            if (onBack) {
                onBack();
            } else {
                navigate('/products');
            }
        } catch (err) {
            console.error('Lỗi tạo sản phẩm', err);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Tạo sản phẩm mới</h2>
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

                <div className="mb-3">
                    <label>Ảnh chính:</label>
                    <input type="file" name="mainImage" className="form-control" onChange={handleMainImageChange} />
                </div>

                <div className="mb-3">
                    <label>Ảnh phụ:</label>
                    <input type="file" name="subImages" className="form-control" multiple onChange={handleSubImagesChange} />
                </div>

                <button type="submit" className="btn btn-success me-2">
                    Tạo
                </button>
                <button type="button" onClick={() => navigate('/products')} className="btn btn-secondary">
                    Quay lại trang sản phẩm
                </button>
            </form>
        </div>
    );
};

export default CreateProduct;
