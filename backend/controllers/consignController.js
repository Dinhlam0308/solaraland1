const Consign = require("../models/consign");

exports.createConsign = async (req, res) => {
    try{
        const consign = new Consign({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            project: req.body.project,
            apartmentType: req.body.apartmentType,
            bedrooms: req.body.bedrooms,
            expectedPrice: req.body.expectedPrice,
            images: req.body.images,
            status: req.body.status,
            transactionStatus: 'available'
        });
        await consign.save();
        res.status(201).json(consign);
    }catch (err){
        console.error(err);
        res.status(500).json({error: err.message});
    }
};

exports.getConsigns = async (req, res) => {
    try {
        const consigns = await Consign.find().sort({ createdAt: -1 });
        res.json(consigns);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getConsignById = async (req, res) => {
    try {
        const consign = await Consign.findById(req.params.id);
        if (!consign) return res.status(404).json({ message: 'Không tìm thấy consign' });
        res.json(consign);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTransactionStatus = async (req, res) => {
    try {
        const { transactionStatus } = req.body; // 'sold' hoặc 'rented' hoặc 'available'
        const consign = await Consign.findByIdAndUpdate(
            req.params.id,
            { transactionStatus },
            { new: true }
        );
        if (!consign) return res.status(404).json({ message: 'Không tìm thấy consign' });
        res.json(consign);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteConsign = async (req, res) => {
    try {
        await Consign.findByIdAndDelete(req.params.id);
        res.json({ message: 'Đã xoá consign' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateConsignImages = async (req, res) => {
    try {
        const { images } = req.body; // mảng url ảnh
        const consign = await Consign.findByIdAndUpdate(
            req.params.id,
            { images },
            { new: true }
        );
        if (!consign) return res.status(404).json({ message: 'Không tìm thấy consign' });
        res.json(consign);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};