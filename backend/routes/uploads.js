const express = require('express');
const uploadCloud = require('../middleware/uploadCloud');

const router = express.Router();

// CKEditor gửi file với field name 'upload'
router.post('/', uploadCloud.single('upload'), async (req, res) => {
    try {
        // sau khi multer-storage-cloudinary upload lên Cloudinary,
        // file info có trong req.file
        // req.file.path là link secure_url
        return res.status(201).json({
            url: req.file.path, // Cloudinary secure_url
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post('/multiple', uploadCloud.array('upload', 5), async (req, res) => {
    try {
        // req.files là mảng các file đã upload lên Cloudinary
        const urls = req.files.map(f => f.path);
        return res.status(201).json({
            urls,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
