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

    // ✅ Tracking visitor với domain thật
    useEffect(() => {
        let visitorId = localStorage.getItem("visitorId");
        if (!visitorId) {
            visitorId = crypto.randomUUID();
            localStorage.setItem("visitorId", visitorId);
        }
        axios
            .post("https://api.solaraland.vn/api/stats/track-visit", {
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
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

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

    // ✅ Upload ảnh dùng API thật
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
                {/* Form fields giữ nguyên */}
            </form>
        </div>
    );
};

export default ConsignManager;
