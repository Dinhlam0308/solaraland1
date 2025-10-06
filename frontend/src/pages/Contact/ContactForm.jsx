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
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setLoading(true)
        try {
            await createContact(formData)
            setSuccess("Gửi liên hệ thành công!")
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
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Họ và tên
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                        Số điện thoại
                    </label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                        Nội dung
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "Đang gửi..." : "Gửi liên hệ"}
                </button>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
            </form>
        </div>
    )
}