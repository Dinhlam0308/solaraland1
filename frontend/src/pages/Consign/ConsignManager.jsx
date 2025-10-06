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

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRemoveImage = (url) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((img) => img !== url),
        }));
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        if (formData.images.length + files.length > 5) {
            alert(`Bạn chỉ được upload tối đa 5 ảnh. Hiện có ${formData.images.length} ảnh rồi.`);
            return;
        }

        try {
            setUploading(true);

            // lấy chữ ký upload Cloudinary từ server
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

            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...urls],
            }));
        } catch (err) {
            console.error("Error uploading file", err);
            alert("Upload ảnh thất bại");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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

            <form onSubmit={handleSubmit}>
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
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Đang upload...</span>
                            </div>
                            <span className="ms-2">Đang upload ảnh...</span>
                        </div>
                    )}
                    <small className="upload-info">
                        Đã upload {formData.images.length}/5 ảnh
                    </small>
                    <div className="image-preview-grid">
                        {formData.images.map((url, idx) => (
                            <div key={idx} className="image-preview-item">
                                <img
                                    src={url || "/placeholder.svg"}
                                    alt="uploaded"
                                    className="image-preview-thumbnail"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(url)}
                                    className="image-remove-button"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading || uploading}
                    >
                        {loading
                            ? "Đang lưu..."
                            : uploading
                                ? "Đang upload ảnh..."
                                : "Ký gửi"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ConsignManager;
