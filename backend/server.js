// Đọc file .env trước
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Nếu bạn còn lưu file ảnh cục bộ trong thư mục uploads thì giữ dòng này,
// còn đã chuyển upload sang Cloudinary thì có thể bỏ
app.use('/uploads', express.static('uploads'));

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import các routes (đảm bảo các file này có tồn tại trong thư mục routes/)
const projectRoutes = require('./routes/projects');
const productRoutes = require('./routes/products');
const newsRoutes = require('./routes/news');
const consignRoutes = require('./routes/consign');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');
const statsRoutes = require('./routes/stats');
// Thêm upload route
const uploadRoutes = require('./routes/uploads');
const cloudinaryRoutes = require('./routes/cloudinary');



// Mount routes
app.use('/api/projects', projectRoutes);
app.use('/api/products', productRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/consigns', consignRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/admin', adminRoutes);
app.use('/api/stats', statsRoutes);
// mount API upload ảnh lên Cloudinary
app.use('/api/upload', uploadRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api', require('./routes/stats'));
// Test route gốc
app.get('/', (req, res) => {
    res.send('Solaraland API is running...');

});

// Khởi động server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
