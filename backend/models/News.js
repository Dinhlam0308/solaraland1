const mongoose = require('mongoose');
const slugify = require('slugify'); // cài npm install slugify

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // generate từ title
    content: String,
    thumbnail: String,
    tags: [String],
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    status: { type: String, enum: ['draft', 'published'], default: 'draft' }
}, { timestamps: true });

// Middleware tự động sinh slug từ title nếu chưa có
newsSchema.pre('validate', function (next) {
    if (this.title && !this.slug) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('News', newsSchema);
