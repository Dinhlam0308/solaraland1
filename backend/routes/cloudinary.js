// routes/cloudinary.js
const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');

// trả chữ ký cho client
router.get('/signature', async (req, res) => {
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Tạo signature
    const signature = cloudinary.utils.api_sign_request(
        { timestamp, folder: 'solaraland' },
        process.env.CLOUDINARY_API_SECRET
    );

    res.json({
        timestamp,
        signature,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        folder: 'solaraland'
    });
});

module.exports = router;
