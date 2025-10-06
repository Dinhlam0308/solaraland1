const Visit = require('../models/Visit');

module.exports = async (req, res, next) => {
    try {
        // Lưu thêm thông tin để sau này phân tích
        await Visit.create({
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            page: req.originalUrl,
            referrer: req.get('Referrer')
        });
    } catch (err) {
        console.error('Error logging visit:', err);
    }
    next();
};
