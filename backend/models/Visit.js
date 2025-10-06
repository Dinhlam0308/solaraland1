const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    ip: String,                // địa chỉ IP hoặc user agent
    userAgent: String,         // thông tin trình duyệt
    page: String,              // page họ vào
    referrer: String,          // nguồn truy cập
    visitorId: String,
    createdAt: { type: Date, default: Date.now } // thời gian truy cập
});

module.exports = mongoose.model('Visit', visitSchema);
