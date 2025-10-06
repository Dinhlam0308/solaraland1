import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../assets/css/Header.css"; // chứa CSS (copy từ style cũ)

const Header = () => {
    const texts = [
        "Căn hộ Quận 1...",
        "Nhà phố giá rẻ...",
        "Văn phòng cho thuê...",
        "Đất nền ngoại ô...",
    ];

    const [textIndex, setTextIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [deleting, setDeleting] = useState(false);
    const [placeholder, setPlaceholder] = useState("");

    useEffect(() => {
        const currentText = texts[textIndex];
        if (!deleting) {
            setPlaceholder(currentText.substring(0, charIndex + 1));
            if (charIndex + 1 === currentText.length) {
                setDeleting(true);
                const timeout = setTimeout(() => {}, 1500);
                return () => clearTimeout(timeout);
            }
            const timeout = setTimeout(() => {
                setCharIndex((prev) => prev + 1);
            }, 100);
            return () => clearTimeout(timeout);
        } else {
            setPlaceholder(currentText.substring(0, charIndex - 1));
            if (charIndex - 1 === 0) {
                setDeleting(false);
                setTextIndex((prev) => (prev + 1) % texts.length);
            }
            const timeout = setTimeout(() => {
                setCharIndex((prev) => prev - 1);
            }, 50);
            return () => clearTimeout(timeout);
        }
    }, [charIndex, deleting, textIndex, texts]);

    useEffect(() => {
        if (!deleting) {
            setCharIndex(0);
        }
    }, [textIndex, deleting]);

    return (
        <header className="header">
            {/* Logo */}
            <div className="logo">
                <img src="/images/Logo.png" alt="Logo" />
            </div>

            {/* Menu */}
            <div className="nav-container">
                <ul className="nav">
                    <li>
                        <a href="/trang-chu">TRANG CHỦ</a>
                    </li>
                    <li>
                        <a href="#">
                            Bất Động Sản <i className="bi bi-caret-down-fill"></i>
                        </a>
                        <ul>
                            <li>
                                <a href="/can-ho">Căn hộ</a>
                            </li>
                            <li>
                                <a href="/nha-pho">Nhà phố</a>
                            </li>
                            <li>
                                <a href="office-tel">Officetel</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="/ky-gui">
                            KÝ GỬI
                        </a>
                    </li>
                    <li>
                        <a href="/tin-tuc">Tin Tức</a>
                    </li>
                    <li>
                        <a href="/lien-he">Liên Hệ</a>
                    </li>
                </ul>
            </div>

            {/* Đã bỏ Search box */}
        </header>
    );
};

export default Header;
