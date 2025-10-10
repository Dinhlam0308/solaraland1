// Đọc file .env (chứa MONGO_URI, PORT,...)
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// ==================== MIDDLEWARE ====================

// Cho phép nhận JSON body
app.use(express.json());

// Cấu hình CORS cho cả frontend và admin
app.use(cors({
  origin: [
    'https://solaraland.vn',
    'https://admin.solaraland.vn'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Nếu bạn vẫn còn lưu ảnh cục bộ trong /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==================== DATABASE ====================

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ==================== ROUTES ====================

// Import routes (đảm bảo các file này có trong /routes)
const projectRoutes = require('./routes/projects');
const productRoutes = require('./routes/products');
const newsRoutes = require('./routes/news');
const consignRoutes = require('./routes/consign');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');
const statsRoutes = require('./routes/stats');
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
app.use('/api/upload', uploadRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('✅ Solaraland API is running on https://api.solaraland.vn');
});

// ==================== SERVER START ====================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
