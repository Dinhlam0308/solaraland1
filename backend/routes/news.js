const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const uploadCloud = require('../middleware/uploadCloud');

// Tạo bài viết (kèm upload ảnh thumbnail)
router.post('/', uploadCloud.single('thumbnail'), newsController.createNews);

// Lấy danh sách bài viết
router.get('/', newsController.getAllNews);

// Lấy chi tiết bài viết theo id
router.get('/id/:id', newsController.getNewsById);

// Lấy chi tiết bài viết theo slug
router.get('/:slug', newsController.getNewsBySlug);

// Cập nhật bài viết (kèm upload ảnh thumbnail)
router.put('/:id', uploadCloud.single('thumbnail'), newsController.updateNews);

// Xóa bài viết
router.delete('/:id', newsController.deleteNews);

module.exports = router;
