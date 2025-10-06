const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    bedrooms: Number,
    description: String,
    type: { type: String, enum: ['can-ho', 'nha-pho', 'office-tel'], required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    mainImage: String,
    subImages: [String],
    status: { type: String, enum: ['sale', 'rent'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
