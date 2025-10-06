const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const MagicToken = require('../models/MagicToken');

exports.requestLogin = async (req, res) => {
    try {
        const { email } = req.body;

        // Chỉ cho phép email admin
        if (email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Tạo magic token lưu DB
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 phút
        await MagicToken.create({ email, token, expiresAt });

        // Cấu hình mailer (SMTP_USER/SMTP_PASS nên là App Password Gmail)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Link login cho frontend (khi deploy đổi lại domain)
        const loginUrl = `http://localhost:5173/verify?token=${token}`;

        // Gửi mail
        await transporter.sendMail({
            from: `"Solaraland Admin" <${process.env.SMTP_USER}>`,
            to: email,
            subject: '🔑 Solaraland Admin Login',
            html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:#f8f9fa;border-radius:8px;">
      <h2 style="color:#2a7be4;text-align:center;">Solaraland Admin</h2>
      <p style="font-size:16px;">Xin chào,</p>
      <p style="font-size:16px;">Bạn vừa yêu cầu đăng nhập quản trị. Nhấn nút dưới đây để đăng nhập:</p>
      <div style="text-align:center;margin:30px 0;">
        <a href="${loginUrl}" 
           style="background:#2a7be4;color:#ffffff;padding:12px 24px;border-radius:4px;
                  text-decoration:none;font-size:16px;display:inline-block;">
          Đăng nhập ngay
        </a>
      </div>
      <p style="font-size:14px;color:#666;">Liên kết này chỉ có hiệu lực trong 10 phút. Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
      <hr style="margin-top:30px;border:none;border-top:1px solid #ddd;">
      <p style="font-size:12px;color:#aaa;text-align:center;">© 2025 Solaraland</p>
    </div>
  `
        });

        res.json({ message: 'Login link sent to your email' });
    } catch (err) {
        console.error('Login error', err);
        res.status(500).json({ error: err.message });
    }
};

exports.verifyToken = async (req, res) => {
    try {
        const { token } = req.body;

        const magicToken = await MagicToken.findOne({ token });
        if (!magicToken)
            return res.status(400).json({ message: 'Invalid token' });

        if (magicToken.expiresAt < new Date())
            return res.status(400).json({ message: 'Token expired' });

        // Tạo JWT 1h
        const jwtToken = jwt.sign(
            { email: magicToken.email, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Xoá magic token sau khi dùng
        await MagicToken.deleteOne({ _id: magicToken._id });

        res.json({ token: jwtToken });
    } catch (err) {
        console.error('Verify token error', err);
        res.status(500).json({ error: err.message });
    }
};
