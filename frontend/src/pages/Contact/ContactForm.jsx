"use client"

import { useState, useEffect } from "react"
import { createContact } from "../../api/contact"
import axios from "axios"
import "../../assets/css/Forms.css"

export default function ContactForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        message: "",
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    useEffect(() => {
        let visitorId = localStorage.getItem("visitorId")
        if (!visitorId) {
            visitorId = crypto.randomUUID()
            localStorage.setItem("visitorId", visitorId)
        }

        axios
            .post("http://localhost:3001/api/stats/track-visit", {
                page: window.location.pathname,
                referrer: document.referrer,
                visitorId,
            })
            .catch((err) => console.error("Error tracking visit", err))
    }, [])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
        setErrors((prev) => ({ ...prev, [e.target.name]: "" })) // xóa lỗi khi nhập lại
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ và tên"
        if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại"
        else if (!/^(0\d{9,10})$/.test(formData.phone))
            newErrors.phone = "Số điện thoại không hợp lệ"
        if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = "Email không hợp lệ"
        if (!formData.message.trim()) newErrors.message = "Vui lòng nhập nội dung"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!validateForm()) return

        setLoading(true)
        try {
            await createContact(formData)
            setSuccess("🎉 Gửi liên hệ thành công! Chúng tôi sẽ sớm phản hồi bạn.")
            setFormData({ name: "", phone: "", email: "", message: "" })
            if (onSuccess) onSuccess()
        } catch (err) {
            setError(err.message || "Có lỗi xảy ra")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="form-container">
            <h2 className="form-title">Liên hệ với chúng tôi</h2>

            <form onSubmit={handleSubmit} noValidate>
                {/* Họ và tên */}
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Họ và tên *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Số điện thoại */}
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Số điện thoại *</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>

                {/* Email */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Nội dung */}
                <div className="mb-3">
                    <label htmlFor="message" className="form-label">Nội dung *</label>
                    <textarea
                        id="message"
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        className={`form-control ${errors.message ? "is-invalid" : ""}`}
                    />
                    {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "Đang gửi..." : "Gửi liên hệ"}
                </button>

                {/* Thông báo gửi */}
                {error && <div className="alert-message error">⚠️ {error}</div>}
                {success && <div className="alert-message success">✅ {success}</div>}
            </form>
        </div>
    )
}
