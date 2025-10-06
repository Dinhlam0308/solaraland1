const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');
const { getStats } = require('../controllers/statController');

router.get('/', getStats);

router.post('/track-visit', async (req, res) => {
    try {
        const { page, referrer, visitorId } = req.body;

        await Visit.create({
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            page,
            referrer,
            visitorId // lưu visitorId từ frontend gửi lên
        });

        res.status(200).json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
