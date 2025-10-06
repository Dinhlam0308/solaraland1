const mongoose = require('mongoose');
const slugify = require('slugify');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    location: String,
    description: String,
    status: { type: String, enum: ['ongoing', 'upcoming'], default: 'ongoing' },
    amenities: [String],
    investor: String,
    metaTitle: String,
    metaDescription: String,
}, { timestamps: true });

// Tự động sinh slug trước khi validate/save
projectSchema.pre('validate', function(next) {
    if (this.name && !this.slug) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('Project', projectSchema);
