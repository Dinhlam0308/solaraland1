const mongoose = require('mongoose');

const MagicTokenSchema = new mongoose.Schema({
    email: { type: String, required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});

// TTL index tự xoá khi hết hạn
MagicTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('MagicToken', MagicTokenSchema);
