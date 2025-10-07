const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

// ==============================
// 📬 TẠO LIÊN HỆ MỚI + GỬI EMAIL
// ==============================
exports.createContact = async (req, res) => {
    try {
        const { name, phone, email, message } = req.body;
        const contact = new Contact({ name, phone, email, message });
        await contact.save();

        // Khởi tạo transporter Gmail
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Template màu Solaraland
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

        // Gửi mail xác nhận cho khách
        if (email) {
            const customerContent = `
                <h3>Xin chào ${name || "Quý khách"},</h3>
                <p>Cảm ơn bạn đã liên hệ với <strong>Solaraland</strong>! 🌞</p>
                <p>Chúng tôi đã nhận được thông tin của bạn và sẽ phản hồi trong thời gian sớm nhất.</p>
                <p style="margin-top: 16px;"><strong>Thông tin liên hệ của bạn:</strong></p>
                <ul>
                    <li><strong>Họ tên:</strong> ${name}</li>
                    <li><strong>Điện thoại:</strong> ${phone}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Nội dung:</strong> ${message}</li>
                </ul>
                <p>Trân trọng,<br><strong>Đội ngũ Solaraland</strong></p>
            `;

            await transporter.sendMail({
                from: `"Solaraland" <${process.env.SMTP_USER}>`,
                to: email,
                subject: "🌞 Solaraland - Xác nhận đã nhận được liên hệ của bạn",
                html: baseTemplate(customerContent),
            });
        }

        // Gửi mail cho admin
        const adminContent = `
            <h3>📩 Có liên hệ mới từ khách hàng!</h3>
            <p><strong>Tên:</strong> ${name}</p>
            <p><strong>Điện thoại:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Nội dung:</strong> ${message}</p>
            <p><em>Thời gian:</em> ${new Date(contact.createdAt).toLocaleString("vi-VN")}</p>
        `;

        await transporter.sendMail({
            from: `"Solaraland" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL || "info@solaraland.vn",
            subject: "📬 Liên hệ mới từ khách hàng Solaraland",
            html: baseTemplate(adminContent),
        });

        res.status(201).json({
            success: true,
            message: "Contact created & emails sent successfully",
            data: contact,
        });
    } catch (err) {
        console.error("❌ Lỗi khi gửi email liên hệ:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};
// ==============================
// 📋 LẤY DANH SÁCH LIÊN HỆ (có thể lọc theo name)
// ==============================
exports.getContacts = async (req, res) => {
    try {
        const { name } = req.query;
        const filter = name ? { name: { $regex: name, $options: "i" } } : {};
        const contacts = await Contact.find(filter).sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ==============================
// 🔍 LẤY 1 LIÊN HỆ THEO ID
// ==============================
exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: "Không tìm thấy liên hệ" });
        }
        res.json(contact);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ==============================
// 🔄 CẬP NHẬT LIÊN HỆ
// ==============================
exports.updateContact = async (req, res) => {
    try {
        const { name, phone, email, message } = req.body;
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { name, phone, email, message },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({ success: false, message: "Không tìm thấy liên hệ" });
        }

        res.json({ success: true, message: "Cập nhật liên hệ thành công", data: contact });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// ==============================
// 🗑️ XOÁ LIÊN HỆ
// ==============================
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: "Không tìm thấy liên hệ" });
        }
        res.json({ success: true, message: "Đã xoá liên hệ thành công" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
