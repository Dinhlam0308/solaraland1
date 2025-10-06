const Product = require('../models/Product');
const Project = require('../models/Project');
// Tạo mới Product
exports.createProduct = async (req, res) => {
    try {
        const mainImage = req.files['mainImage'] ? req.files['mainImage'][0].path : null;
        const subImages = req.files['subImages'] ? req.files['subImages'].map(f => f.path) : [];

        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            bedrooms: req.body.bedrooms,
            description: req.body.description,
            type: req.body.type,
            project: req.body.project,
            mainImage,
            subImages,
            status: req.body.status
        });

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Lấy danh sách tất cả Product
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('project');
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Lấy một Product theo id
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('project');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Sửa Product
exports.updateProduct = async (req, res) => {
    try {
        // Nếu upload ảnh mới thì lấy ảnh mới, không thì giữ cũ
        const updateData = {
            name: req.body.name,
            price: req.body.price,
            bedrooms: req.body.bedrooms,
            description: req.body.description,
            type: req.body.type,
            project: req.body.project,
            status: req.body.status
        };

        if (req.files['mainImage']) {
            updateData.mainImage = req.files['mainImage'][0].path;
        }

        if (req.files['subImages']) {
            updateData.subImages = req.files['subImages'].map(f => f.path);
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Xóa Product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteSubImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl } = req.body; // ảnh muốn xóa (truyền trong body)

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });

        // lọc bỏ ảnh phụ đó
        product.subImages = product.subImages.filter((img) => img !== imageUrl);
        await product.save();

        res.json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getProductsForRent = async (req, res) => {
    try {
        const products = await Product.find({ status: 'rent' }).populate('project');
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Lấy danh sách sản phẩm đang bán
exports.getProductsForSale = async (req, res) => {
    try {
        const products = await Product.find({ status: 'sale' }).populate('project');
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Lấy danh sách sản phẩm sale theo project, nếu không có trả project info
exports.getProjectWithSaleProducts = async (req, res) => {
    try {
        const { projectId } = req.params;

        // lấy project
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: 'Không tìm thấy dự án' });

        // lấy sản phẩm đang bán
        const products = await Product.find({ project: projectId, status: 'sale' });

        res.json({
            project,        // thông tin dự án
            products,       // danh sách sản phẩm sale (mảng rỗng nếu không có)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Lọc sản phẩm theo điều kiện
exports.filterProducts = async (req, res) => {
    try {
        const { priceMin, priceMax, bedrooms, type, projectId } = req.query;
        const query = {};

        if (projectId) query.project = projectId;
        query.status = 'sale'; // chỉ lấy sản phẩm đang bán

        if (bedrooms) {
            // có thể chọn nhiều số phòng, ngăn cách bằng dấu ,
            query.bedrooms = { $in: bedrooms.split(',').map(Number) };
        }

        if (type) {
            query.type = { $in: type.split(',') };
        }

        if (priceMin || priceMax) {
            query.price = {};
            if (priceMin) query.price.$gte = Number(priceMin);
            if (priceMax) query.price.$lte = Number(priceMax);
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getProductsByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        // có thể thêm status = 'sale' hoặc 'rent' tùy ý
        const products = await Product.find({ project: projectId }).populate('project');
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getProductsByType = async (req, res) => {
    try {
        const { type } = req.params; // can-ho, nha-pho, office-tel
        const products = await Product.find({ type }).populate('project');
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Lọc nâng cao theo nhiều điều kiện
exports.advancedFilterProducts = async (req, res) => {
    try {
        const { priceMin, priceMax, bedrooms, type, status } = req.query;
        const query = {};

        if (status) {
            query.status = status; // 'rent' hoặc 'sale'
        }

        if (type) {
            query.type = { $in: type.split(',') }; // 'can-ho', 'nha-pho', 'office-tel'
        }

        if (bedrooms) {
            query.bedrooms = { $in: bedrooms.split(',').map(Number) }; // 1,2,3,...
        }

        if (priceMin || priceMax) {
            query.price = {};
            if (priceMin) query.price.$gte = Number(priceMin);
            if (priceMax) query.price.$lte = Number(priceMax);
        }

        const products = await Product.find(query).populate('project');
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getProductByName = async (req, res) => {
    try {
        const { name } = req.params;
        // tìm chính xác theo name
        const product = await Product.findOne({ name }).populate('project');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};