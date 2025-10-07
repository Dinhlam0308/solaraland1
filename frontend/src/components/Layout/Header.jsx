"use client"

import { useState, useEffect } from "react"
import "bootstrap-icons/font/bootstrap-icons.css"
import "../../assets/css/Header.css"

const Header = () => {
    const texts = ["Căn hộ Quận 1...", "Nhà phố giá rẻ...", "Văn phòng cho thuê...", "Đất nền ngoại ô..."]

    const [textIndex, setTextIndex] = useState(0)
    const [charIndex, setCharIndex] = useState(0)
    const [deleting, setDeleting] = useState(false)
    const [placeholder, setPlaceholder] = useState("")
    const [menuOpen, setMenuOpen] = useState(false)
    const [submenuOpen, setSubmenuOpen] = useState(false)

    // Hiệu ứng typing
    useEffect(() => {
        const currentText = texts[textIndex]
        if (!deleting) {
            setPlaceholder(currentText.substring(0, charIndex + 1))
            if (charIndex + 1 === currentText.length) {
                setDeleting(true)
                const timeout = setTimeout(() => {}, 1500)
                return () => clearTimeout(timeout)
            }
            const timeout = setTimeout(() => setCharIndex((prev) => prev + 1), 100)
            return () => clearTimeout(timeout)
        } else {
            setPlaceholder(currentText.substring(0, charIndex - 1))
            if (charIndex - 1 === 0) {
                setDeleting(false)
                setTextIndex((prev) => (prev + 1) % texts.length)
            }
            const timeout = setTimeout(() => setCharIndex((prev) => prev - 1), 50)
            return () => clearTimeout(timeout)
        }
    }, [charIndex, deleting, textIndex, texts])

    useEffect(() => {
        if (!deleting) setCharIndex(0)
    }, [textIndex, deleting])

    // Đóng menu khi resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) setMenuOpen(false)
        }
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <header className="header">
            {/* Logo + Toggle */}
            <div className="logo">
                <img src="/images/Logo.png" alt="Logo" />
                {/* ✅ Icon menu chỉ render ở mobile/tablet */}
                {typeof window !== "undefined" && window.innerWidth <= 1024 && (
                    <i
                        className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"} menu-toggle`}
                        onClick={() => setMenuOpen(!menuOpen)}
                    ></i>
                )}
            </div>

            {/* Overlay khi mở menu */}
            <div
                className={`overlay ${menuOpen ? "show" : ""}`}
                onClick={() => setMenuOpen(false)}
            ></div>

            {/* Menu chính */}
            <div className={`nav-container ${menuOpen ? "active" : ""}`}>
                {/* Nút đóng trong menu */}
                <div className="menu-close" onClick={() => setMenuOpen(false)}>
                    <i className="bi bi-x-lg"></i>
                </div>

                <ul className="nav">
                    <li><a href="/trang-chu">TRANG CHỦ</a></li>

                    <li
                        className={`has-submenu ${submenuOpen ? "open" : ""}`}
                        onClick={() => setSubmenuOpen(!submenuOpen)}
                    >
                        <a href="#">
                            Bất Động Sản <i className="bi bi-caret-down-fill"></i>
                        </a>
                        <ul>
                            <li><a href="/can-ho">Căn hộ</a></li>
                            <li><a href="/nha-pho">Nhà phố</a></li>
                            <li><a href="/office-tel">Officetel</a></li>
                        </ul>
                    </li>

                    <li><a href="/ky-gui">KÝ GỬI</a></li>
                    <li><a href="/tin-tuc">TIN TỨC</a></li>
                    <li><a href="/lien-he">LIÊN HỆ</a></li>
                </ul>
            </div>
        </header>
    )
}

export default Header
