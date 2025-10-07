"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createConsign } from "../../api/consign";
import axios from "axios";
import "../../assets/css/Forms.css";

const ConsignManager = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        project: "",
        apartmentType: "",
        bedrooms: "",
        expectedPrice: "",
        images: [],
        status: "sale",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    // Tracking visitor
    useEffect(() => {
        let visitorId = localStorage.getItem("visitorId");
        if (!visitorId) {
            visitorId = crypto.randomUUID();
            localStorage.setItem("visitorId", visitorId);
        }
        axios
            .post("http://localhost:3001/api/stats/track-visit", {
                page: window.location.pathname,
                referrer: document.referrer,
                visitorId,
            })
            .catch((err) => console.error("Error tracking visit", err));
    }, []);

    // Input change handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" })); // clear lỗi khi user sửa
    };

    // Validate trước khi submit
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên của bạn";
        if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
        else if (!/^(0\d{9,10})$/.test(formData.phone))
            newErrors.phone = "Số điện thoại không hợp lệ";
        if (!formData.apartmentType)
            newErrors.apartmentType = "Vui lòng chọn loại bất động sản";
        if (!formData.expectedPrice)
            newErrors.expectedPrice = "Vui lòng nhập giá mong đợi";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Upload ảnh
    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        if (formData.images.length + files.length > 5) {
            alert(`Bạn chỉ được upload tối đa 5 ảnh.`);
            return;
        }

        try {
            setUploading(true);
            const sigRes = await axios.get("http://localhost:3001/api/cloudinary/signature");
            const { timestamp, signature, apiKey, cloudName, folder } = sigRes.data;

            const uploadPromises = files.map((file) => {
                const fd = new FormData();
                fd.append("file", file);
                fd.append("api_key", apiKey);
                fd.append("timestamp", timestamp);
                fd.append("signature", signature);
                fd.append("folder", folder);
                return axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    fd,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            });

            const results = await Promise.all(uploadPromises);
            const urls = results.map((r) => r.data.secure_url);
            setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
        } catch (err) {
            console.error("Error uploading file", err);
            alert("Upload ảnh thất bại");
        } finally {
            setUploading(false);
        }
    };

    // Xóa ảnh
    const handleRemoveImage = (url) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((img) => img !== url),
        }));
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (uploading) {
            alert("Vui lòng đợi upload ảnh xong trước khi ký gửi");
            return;
        }
        try {
            setLoading(true);
            await createConsign(formData);
            alert("Thêm consign thành công!");
            navigate("/");
        } catch (err) {
            console.error("Error creating consign", err);
            alert("Có lỗi xảy ra khi thêm consign");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Thêm Consign mới</h2>

            <form onSubmit={handleSubmit} noValidate>
                {/* Tên */}
                <div className="mb-3">
                    <label className="form-label">Tên *</label>
                    <input
                        type="text"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Số điện thoại và email */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Điện thoại *</label>
                        <input
                            type="text"
                            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
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

                {/* Loại và dự án */}
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
                        <label className="form-label">Loại bất động sản *</label>
                        <select
                            className={`form-select ${errors.apartmentType ? "is-invalid" : ""}`}
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
                        {errors.apartmentType && (
                            <div className="invalid-feedback">{errors.apartmentType}</div>
                        )}
                    </div>
                </div>

                {/* Giá mong đợi */}
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
                        <label className="form-label">Giá mong đợi *</label>
                        <input
                            type="number"
                            className={`form-control ${errors.expectedPrice ? "is-invalid" : ""}`}
                            name="expectedPrice"
                            value={formData.expectedPrice}
                            onChange={handleChange}
                        />
                        {errors.expectedPrice && (
                            <div className="invalid-feedback">{errors.expectedPrice}</div>
                        )}
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

                {/* Upload ảnh */}
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
                            <div className="spinner-border" role="status"></div>
                            <span className="ms-2">Đang upload ảnh...</span>
                        </div>
                    )}
                    <small className="upload-info">
                        Đã upload {formData.images.length}/5 ảnh
                    </small>
                </div>

                {/* Submit */}
                <div className="mt-4 text-center">
                    <button
                        type="submit"
                        className="btn btn-primary px-4"
                        disabled={loading || uploading}
                    >
                        {loading ? "Đang lưu..." : "Ký gửi"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ConsignManager;
