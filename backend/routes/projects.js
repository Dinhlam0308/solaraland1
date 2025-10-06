const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const uploadCloud = require('../middleware/uploadCloud');

// Tạo dự án mới
router.post('/', uploadCloud.single('thumbnail'), projectController.createProject);

// Lấy danh sách dự án
router.get('/', projectController.getProjects);

// Lấy dự án theo slug
router.get('/slug/:slug', projectController.getProjectBySlug);

router.get('/:id', projectController.getProjectById);

// Cập nhật dự án
router.put('/:id', uploadCloud.single('thumbnail'), projectController.updateProject);

// Xóa dự án
router.delete('/:id', projectController.deleteProject);

module.exports = router;
