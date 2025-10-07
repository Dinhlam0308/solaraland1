const Consign = require("../models/consign");
const nodemailer = require("nodemailer");

// ==============================
// 📦 TẠO CONSIGN + GỬI EMAIL
// ==============================
exports.createConsign = async (req, res) => {
    try {
        const consign = new Consign({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            project: req.body.project,
            apartmentType: req.body.apartmentType,
            bedrooms: req.body.bedrooms,
            expectedPrice: req.body.expectedPrice,
            images: req.body.images,
            status: req.body.status,
            transactionStatus: "available",
        });

        await consign.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const baseTemplate = (content) => `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">
                    <div style="background-color: #ffe0b0; padding: 20px; text-align: center;">
                        <img src="https://res.cloudinary.com/dtl4dhlao/image/upload/v1728412345/logo.png" alt="Solaraland Logo" style="height: 60px; margin-bottom: 8px;">
                        <h2 style="color: #2c3e50; margin: 0;">Solaraland</h2>
                    </div>
                    <div style="padding: 25px; color: #333; line-height: 1.6;">
                        ${content}
                    </div>
                    <div style="background-color: #f39c12; color: #fff; text-align: center; padding: 10px; font-size: 14px;">
                        © ${new Date().getFullYear()} Solaraland. All rights reserved.
                    </div>
                </div>
            </div>
        `;

        // Gửi mail cho khách hàng
        if (consign.email) {
            const customerContent = `
                <h3>Xin chào ${consign.name},</h3>
                <p>Cảm ơn bạn đã <strong>ký gửi bất động sản</strong> tại <strong>Solaraland</strong> 🌞</p>
                <p>Chúng tôi đã nhận thông tin của bạn và sẽ liên hệ lại trong thời gian sớm nhất.</p>
                <p><strong>Chi tiết ký gửi:</strong></p>
                <ul>
                    <li>Dự án: ${consign.project || "Chưa cung cấp"}</li>
                    <li>Loại BĐS: ${consign.apartmentType}</li>
                    <li>Số phòng ngủ: ${consign.bedrooms || "Không rõ"}</li>
                    <li>Giá mong đợi: ${consign.expectedPrice || "Không rõ"} triệu VNĐ</li>
                    <li>Hình thức: ${consign.status === "sale" ? "Bán" : "Cho thuê"}</li>
                </ul>
                <p>Trân trọng,<br><strong>Đội ngũ Solaraland</strong></p>
            `;

            await transporter.sendMail({
                from: `"Solaraland" <${process.env.SMTP_USER}>`,
                to: consign.email,
                subject: "🌞 Solaraland - Xác nhận ký gửi bất động sản",
                html: baseTemplate(customerContent),
            });
        }

        // Gửi mail thông báo cho admin
        const adminContent = `
            <h3>📢 Có consign mới từ khách hàng!</h3>
            <p><strong>Tên:</strong> ${consign.name}</p>
            <p><strong>Điện thoại:</strong> ${consign.phone}</p>
            <p><strong>Email:</strong> ${consign.email}</p>
            <p><strong>Dự án:</strong> ${consign.project}</p>
            <p><strong>Giá mong đợi:</strong> ${consign.expectedPrice} triệu VNĐ</p>
            ${
            consign.images && consign.images.length
                ? `<p><strong>Ảnh:</strong><br>${consign.images
                    .map(
                        (url) =>
                            `<img src="${url}" style="max-width:150px; border-radius:8px; margin:5px;">`
                    )
                    .join("")}</p>`
                : ""
        }
            <p><em>Thời gian:</em> ${new Date(consign.createdAt).toLocaleString("vi-VN")}</p>
        `;

        await transporter.sendMail({
            from: `"Solaraland" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL || "sales@solaraland.vn",
            subject: "📬 Solaraland - Có consign mới từ khách hàng",
            html: baseTemplate(adminContent),
        });

        res.status(201).json(consign);
    } catch (err) {
        console.error("❌ Lỗi khi tạo consign:", err);
        res.status(500).json({ error: err.message });
    }
};
// ==============================
// 📋 LẤY DANH SÁCH CONSIGN
// ==============================
exports.getConsigns = async (req, res) => {
    try {
        const consigns = await Consign.find().sort({ createdAt: -1 });
        res.json(consigns);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==============================
// 🔍 LẤY CONSIGN THEO ID
// ==============================
exports.getConsignById = async (req, res) => {
    try {
        const consign = await Consign.findById(req.params.id);
        if (!consign) return res.status(404).json({ message: "Không tìm thấy consign" });
        res.json(consign);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==============================
// 🔄 CẬP NHẬT TRẠNG THÁI GIAO DỊCH
// ==============================
exports.updateTransactionStatus = async (req, res) => {
    try {
        const { transactionStatus } = req.body; // 'sold' | 'rented' | 'available'
        const consign = await Consign.findByIdAndUpdate(
            req.params.id,
            { transactionStatus },
            { new: true }
        );
        if (!consign) return res.status(404).json({ message: "Không tìm thấy consign" });
        res.json(consign);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==============================
// 🗑️ XOÁ CONSIGN
// ==============================
exports.deleteConsign = async (req, res) => {
    try {
        await Consign.findByIdAndDelete(req.params.id);
        res.json({ message: "Đã xoá consign" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==============================
// 🖼️ CẬP NHẬT ẢNH CONSIGN
// ==============================
exports.updateConsignImages = async (req, res) => {
    try {
        const { images } = req.body; // mảng url ảnh
        const consign = await Consign.findByIdAndUpdate(
            req.params.id,
            { images },
            { new: true }
        );
        if (!consign) return res.status(404).json({ message: "Không tìm thấy consign" });
        res.json(consign);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
