const slugify = require('slugify');
const Project = require('../models/Project');

// Tạo mới Project
exports.createProject = async (req, res) => {
    try {
        let {
            name,
            location,
            description,
            status,
            amenities,
            investor,
            metaTitle,
            metaDescription
        } = req.body;

        // Sinh slug từ name
        const slug = slugify(name, { lower: true, strict: true });

        // Nếu metaDescription chưa có thì tự sinh từ description
        if (!metaDescription && description) {
            const plainText = description.replace(/<[^>]+>/g, '');
            metaDescription = plainText.slice(0, 160);
        }

        // Nếu metaTitle chưa có thì tự sinh từ name
        if (!metaTitle && name) {
            metaTitle = name;
        }

        const newProject = await Project.create({
            name,
            location,
            description,
            status,
            amenities,
            investor,
            slug,
            metaTitle,
            metaDescription
        });

        res.status(201).json({ success: true, data: newProject });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Lấy tất cả Projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy Project theo ID (hiển thị thông tin cũ)
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy dự án' });
        }
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy Project theo slug
exports.getProjectBySlug = async (req, res) => {
    try {
        const project = await Project.findOne({ slug: req.params.slug });
        if (!project) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy dự án' });
        }
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật Project (cập nhật xong trả về bản ghi mới)
exports.updateProject = async (req, res) => {
    try {
        let updateData = { ...req.body };

        // Sinh lại slug nếu có name mới
        if (updateData.name) {
            updateData.slug = slugify(updateData.name, { lower: true, strict: true });
        }

        // Nếu metaDescription chưa có mà description có thì tự sinh lại
        if (!updateData.metaDescription && updateData.description) {
            const plainText = updateData.description.replace(/<[^>]+>/g, '');
            updateData.metaDescription = plainText.slice(0, 160);
        }

        // Nếu metaTitle chưa có mà name có thì tự sinh lại
        if (!updateData.metaTitle && updateData.name) {
            updateData.metaTitle = updateData.name;
        }

        // Cập nhật và trả về bản ghi mới
        const project = await Project.findByIdAndUpdate(req.params.id, updateData, {
            new: true, // trả về document mới sau khi update
            runValidators: true
        });

        if (!project) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy dự án' });
        }

        // Trả về bản ghi mới để client hiển thị lại thông tin cũ
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Xóa Project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy dự án' });
        }
        res.status(200).json({ success: true, message: 'Xóa dự án thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
