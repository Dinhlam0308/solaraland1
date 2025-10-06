const express = require('express');
const router = express.Router();
const consignController = require('../controllers/consignController');

// khách gửi form ký gửi
router.post('/', consignController.createConsign);

// admin xem danh sách
router.get('/', consignController.getConsigns);

// xem chi tiết 1 consign
router.get('/:id', consignController.getConsignById);

// admin cập nhật trạng thái giao dịch
router.put('/:id/status', consignController.updateTransactionStatus);

// admin xoá consign
router.delete('/:id', consignController.deleteConsign);
router.put('/:id/images', async (req, res) => {
    try {
        const { images } = req.body;
        const consign = await Consign.findByIdAndUpdate(req.params.id, { images }, { new: true });
        res.json(consign);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;
