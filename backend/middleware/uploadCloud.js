const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'solaraland',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
    }
});

const uploadCloud = multer({ storage });
module.exports = uploadCloud;
