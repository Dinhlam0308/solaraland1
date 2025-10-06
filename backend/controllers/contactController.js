const Contact = require('../models/Contact');

// Tạo mới liên hệ
exports.createContact = async (req, res) => {
    try {
        const { name, phone, email, message } = req.body;

        const contact = new Contact({
            name,
            phone,
            email,
            message
        });

        await contact.save();

        res.status(201).json({
            success: true,
            message: 'Contact saved successfully',
            data: contact
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Lấy danh sách liên hệ (có thể lọc theo name ?name=abc)
exports.getContacts = async (req, res) => {
    try {
        const { name } = req.query;
        const filter = {};

        if (name) {
            // tìm theo name gần đúng, không phân biệt hoa thường
            filter.name = { $regex: name, $options: 'i' };
        }

        const contacts = await Contact.find(filter).sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Lấy một liên hệ theo id
exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        res.json(contact);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Cập nhật liên hệ theo id
exports.updateContact = async (req, res) => {
    try {
        const { name, phone, email, message } = req.body;

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { name, phone, email, message },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }

        res.json({ success: true, message: 'Contact updated successfully', data: contact });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Xóa một liên hệ theo id
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        res.json({ success: true, message: 'Contact deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
