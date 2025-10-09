const mongoose = require('mongoose');

const consignSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    project: String,
    apartmentType: String,
    bedrooms: Number,
    expectedPrice: Number,
    images: [String],
    status: { type: String, enum: ['sale', 'rent'], required: true },
    transactionStatus: {
        type: String,
        enum: ['available', 'sold', 'rented'],
        default: 'available'
    },

    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Consign',consignSchema);


