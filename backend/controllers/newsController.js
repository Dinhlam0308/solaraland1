const News = require('../models/News');

// Hàm tạo slug
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD') // bỏ dấu tiếng Việt
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-') // thay ký tự đặc biệt bằng '-'
        .replace(/^-+|-+$/g, '') // bỏ - đầu/cuối
        .replace(/--+/g, '-'); // bỏ -- liên tiếp
}

// Tạo mới
exports.createNews = async (req, res) => {
    try {
        const data = req.body;

        // Nếu có upload thumbnail thì lấy từ req.file.path (Cloudinary secure_url)
        if (req.file) {
            data.thumbnail = req.file.path;
        }

        // tự sinh slug nếu chưa có
        if (!data.slug && data.title) {
            data.slug = slugify(data.title);
        }

        // metaTitle tự = title nếu chưa có
        if (!data.metaTitle && data.title) {
            data.metaTitle = data.title;
        }

        // metaDescription tự lấy 160 ký tự đầu từ content nếu chưa có
        if (!data.metaDescription && data.content) {
            const plainText = data.content.replace(/<[^>]+>/g, '');
            data.metaDescription = plainText.slice(0, 160);
        }

        const news = new News(data);
        const savedNews = await news.save();
        res.status(201).json(savedNews);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Lấy danh sách
exports.getAllNews = async (req, res) => {
    try {
        const newsList = await News.find().sort({ createdAt: -1 });
        res.json(newsList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy theo id
exports.getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ message: 'Không tìm thấy' });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy theo slug
exports.getNewsBySlug = async (req, res) => {
    try {
        const news = await News.findOne({ slug: req.params.slug });
        if (!news) return res.status(404).json({ message: 'Không tìm thấy' });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật
exports.updateNews = async (req, res) => {
    try {
        const data = req.body;
        if (req.file) {
            data.thumbnail = req.file.path; // nếu upload ảnh mới
        }

        let news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ message: 'Không tìm thấy' });

        // update slug/meta nếu chưa có
        if (!data.slug && data.title) {
            data.slug = slugify(data.title);
        }
        if (!data.metaTitle && data.title) {
            data.metaTitle = data.title;
        }
        if (!data.metaDescription && data.content) {
            const plainText = data.content.replace(/<[^>]+>/g, '');
            data.metaDescription = plainText.slice(0, 160);
        }

        Object.assign(news, data);
        await news.save();

        res.json(news);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa
exports.deleteNews = async (req, res) => {
    try {
        const deletedNews = await News.findByIdAndDelete(req.params.id);
        if (!deletedNews) return res.status(404).json({ message: 'Không tìm thấy' });
        res.json({ message: 'Đã xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
