import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createConsign } from '../../api/consign';
import axios from 'axios';

const ConsignManager = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        project: '',
        apartmentType: '',
        bedrooms: '',
        expectedPrice: '',
        images: [], // URL ảnh Cloudinary
        status: 'sale',
    });

    const [loading, setLoading] = useState(false); // khi submit form
    const [uploading, setUploading] = useState(false); // khi upload ảnh
    const navigate = useNavigate();

    // 🔹 Tracking lượt truy cập trang này
    useEffect(() => {
        // tạo visitorId duy nhất nếu chưa có
        let visitorId = localStorage.getItem('visitorId');
        if (!visitorId) {
            visitorId = crypto.randomUUID();
            localStorage.setItem('visitorId', visitorId);
        }

        axios.post('http://localhost:3001/api/stats/track-visit', {
            page: window.location.pathname,
            referrer: document.referrer,
            visitorId
        }).catch(err => console.error('Error tracking visit', err));
    }, []);

    // thay đổi input text/select
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // xoá ảnh đã upload
    const handleRemoveImage = (url) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((img) => img !== url),
        }));
    };

    // upload nhiều ảnh song song lên Cloudinary
    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        if (formData.images.length + files.length > 5) {
            alert(`Bạn chỉ được upload tối đa 5 ảnh. Hiện có ${formData.images.length} ảnh rồi.`);
            return;
        }

        try {
            setUploading(true); // bật spinner

            // gọi server lấy signature
            const sigRes = await axios.get('http://localhost:3001/api/cloudinary/signature');
            const { timestamp, signature, apiKey, cloudName, folder } = sigRes.data;

            // upload song song lên Cloudinary
            const uploadPromises = files.map((file) => {
                const fd = new FormData();
                fd.append('file', file);
                fd.append('api_key', apiKey);
                fd.append('timestamp', timestamp);
                fd.append('signature', signature);
                fd.append('folder', folder);

                return axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    fd,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
            });

            const results = await Promise.all(uploadPromises);
            const urls = results.map((r) => r.data.secure_url);

            // lưu URL ảnh vào formData
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...urls],
            }));
        } catch (err) {
            console.error('Error uploading file', err);
            alert('Upload ảnh thất bại');
        } finally {
            setUploading(false); // tắt spinner
        }
    };

    // submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (uploading) {
            alert('Vui lòng đợi upload ảnh xong trước khi ký gửi');
            return;
        }
        try {
            setLoading(true);
            await createConsign(formData); // gửi JSON với images là URL Cloudinary
            alert('Thêm consign thành công!');
            navigate('/'); // chuyển trang nếu muốn
        } catch (err) {
            console.error('Error creating consign', err);
            alert('Có lỗi xảy ra khi thêm consign');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Thêm Consign mới</h2>
            </div>

            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="form-label">Tên</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Điện thoại</label>
                        <input
                            type="text"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Dự án</label>
                        <input
                            type="text"
                            className="form-control"
                            name="project"
                            value={formData.project}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Loại bất động sản</label>
                        <select
                            className="form-select"
                            name="apartmentType"
                            value={formData.apartmentType}
                            onChange={handleChange}
                        >
                            <option value="">-- Chọn loại --</option>
                            <option value="can-ho">Căn hộ</option>
                            <option value="nha-dat">Nhà đất</option>
                            <option value="dat-nen">Đất nền</option>
                            <option value="office-tel">Office-tel</option>
                            <option value="nha-pho">Nhà phố</option>
                        </select>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Số phòng ngủ</label>
                        <input
                            type="number"
                            className="form-control"
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Giá mong đợi</label>
                        <input
                            type="number"
                            className="form-control"
                            name="expectedPrice"
                            value={formData.expectedPrice}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Hình thức</label>
                        <select
                            className="form-select"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="sale">Bán</option>
                            <option value="rent">Cho thuê</option>
                        </select>
                    </div>
                </div>

                {/* Upload file ảnh */}
                <div className="mb-3">
                    <label className="form-label">Tải tối đa 5 ảnh</label>
                    <input
                        type="file"
                        className="form-control"
                        multiple
                        onChange={handleFileUpload}
                    />
                    {uploading && (
                        <div className="my-2 d-flex align-items-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Đang upload...</span>
                            </div>
                            <span className="ms-2">Đang upload ảnh...</span>
                        </div>
                    )}
                    <small className="text-muted">
                        Đã upload {formData.images.length}/5 ảnh
                    </small>
                    <div className="mt-2 d-flex flex-wrap gap-2">
                        {formData.images.map((url, idx) => (
                            <div
                                key={idx}
                                style={{
                                    position: 'relative',
                                    width: 100,
                                    height: 100,
                                }}
                            >
                                <img
                                    src={url}
                                    alt="uploaded"
                                    width={100}
                                    height={100}
                                    className="img-thumbnail"
                                    style={{ objectFit: 'cover' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(url)}
                                    style={{
                                        position: 'absolute',
                                        top: 2,
                                        right: 2,
                                        background: 'red',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        lineHeight: '18px',
                                        padding: 0,
                                        cursor: 'pointer',
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Nút Ký gửi */}
                <div className="mt-4 text-center">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || uploading}
                    >
                        {loading
                            ? 'Đang lưu...'
                            : uploading
                                ? 'Đang upload ảnh...'
                                : 'Ký gửi'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ConsignManager;
