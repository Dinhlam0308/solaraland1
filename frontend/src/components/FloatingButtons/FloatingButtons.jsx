import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import "../../assets/css/FloatingButtons.css";

export default function FloatingButtons() {
  return (
    <div className="floating-buttons">
      {/* Nút Zalo */}
      <a
        href="https://zalo.me/0968992882" // 👉 Thay bằng số Zalo của bạn
        className="btn-zalo"
        target="_blank"
        rel="noopener noreferrer"
      >
        <SiZalo className="icon" />
      </a>

      {/* Nút gọi điện */}
      <a href="tel:0968992882" className="btn-phone">
        <FaPhoneAlt className="icon" />
      </a>
    </div>
  );
}
