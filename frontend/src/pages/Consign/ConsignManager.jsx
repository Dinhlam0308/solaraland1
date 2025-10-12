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

    // ✅ Tracking Visitor
    useEffect(() => {
        let visitorId = localStorage.getItem("visitorId");
        if (!visitorId) {
            visitorId = window.crypto?.randomUUID?.() || Math.random().toString(36).substring(2);
            localStorage.setItem("visitorId", visitorId);
        }

        axios.post("https://api.solaraland.vn/api/stats/track-visit", {
            page: window.location.pathname,
            referrer: document.referrer,
            visitorId,
        }).catch((err) => console.error("Error tracking visit", err));
    }, []);

    // ✅ Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // ✅ Validate Form
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên của bạn";
        if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
        if (!/^(0\d{9,10})$/.test(formData.phone))
            newErrors.phone = "Số điện thoại không hợp lệ";
        if (!formData.apartmentType)
            newErrors.apartmentType = "Vui lòng chọn loại bất động sản";
        if (!formData.expectedPrice)
            newErrors.expectedPrice = "Vui lòng nhập giá mong đợi";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ UPLOAD ẢNH VỚI API THẬT
    // ✅ Upload ảnh có preview + xóa ảnh
const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // ✅ Kiểm tra không vượt quá 5 ảnh
    if (formData.images.length + files.length > 5) {
        alert(`Bạn chỉ được upload tối đa 5 ảnh.`);
        return;
    }

    try {
        setUploading(true);

        // Lấy chữ ký Cloudinary từ API thật
        const sigRes = await axios.get("https://api.solaraland.vn/api/cloudinary/signature");
        const { timestamp, signature, apiKey, cloudName, folder } = sigRes.data;

        // ✅ Upload từng ảnh lên Cloudinary
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

        // ✅ Lấy URL ảnh trả về
        const results = await Promise.all(uploadPromises);
        const urls = results.map((r) => r.data.secure_url);

        // ✅ Cập nhật ảnh vào formData (tích lũy - không ghi đè)
        setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
        console.error("Error uploading file", err);
        alert("Upload ảnh thất bại");
    } finally {
        setUploading(false);
    }
};

// ✅ Hàm xoá ảnh
const handleRemoveImage = (url) => {
    setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img !== url),
    }));
};

    // ✅ Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (uploading) {
            alert("Vui lòng đợi upload ảnh xong rồi gửi");
            return;
        }
        try {
            setLoading(true);
            await createConsign(formData);
            alert("Gửi ký gửi thành công!");
            navigate("/");
        } catch (err) {
            console.error("Error creating consign", err);
            alert("Có lỗi xảy ra khi gửi consign");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Thêm Consign mới</h2>
            <form onSubmit={handleSubmit} noValidate>

                {/* ======= FORM FIELD GIỮ NGUYÊN TẤT CẢ ======= */}
                {/* ✅ Tên */}
                <div className="mb-3">
                    <label className="form-label">Tên *</label>
                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} />
                </div>

                {/* ✅ Số điện thoại & Email */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Điện thoại *</label>
                        <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                    </div>
                </div>

                {/* ✅ Dự án & loại */}
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Dự án</label>
                        <input type="text" name="project" className="form-control" value={formData.project} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Loại BĐS *</label>
                        <select name="apartmentType" className="form-select" value={formData.apartmentType} onChange={handleChange}>
                            <option value="">-- Chọn loại --</option>
                            <option value="can-ho">Căn hộ</option>
                            <option value="nha-dat">Nhà đất</option>
                            <option value="dat-nen">Đất nền</option>
                            <option value="office-tel">Office-tel</option>
                            <option value="nha-pho">Nhà phố</option>
                        </select>
                    </div>
                </div>

                {/* ✅ Giá mong đợi + phòng ngủ */}
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Số phòng ngủ</label>
                        <input type="number" name="bedrooms" className="form-control" value={formData.bedrooms} onChange={handleChange} />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Giá mong đợi *</label>
                        <input type="number" name="expectedPrice" className="form-control" value={formData.expectedPrice} onChange={handleChange} />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Hình thức</label>
                        <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                            <option value="sale">Bán</option>
                            <option value="rent">Cho thuê</option>
                        </select>
                    </div>
                </div>

                {/* ✅ Upload ảnh */}
                <div className="mb-3">
                    <label className="form-label">Tải tối đa 5 ảnh</label>
                    <input type="file" className="form-control" multiple onChange={handleFileUpload} />
                    {uploading && <div>Đang upload ảnh...</div>}
                </div>

                {/* ✅ Submit */}
                <div className="text-center mt-4">
                    <button className="btn btn-primary" disabled={loading || uploading}>
                        {loading ? "Đang gửi..." : "Ký gửi ngay"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ConsignManager;
