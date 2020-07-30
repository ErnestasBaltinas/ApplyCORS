const mongoose = require('mongoose');

const corsUrls = new mongoose.Schema({
    urlId: {
        type: String,
        required: true
    },
    fullOriginalUrl: {
        type: String,
        required: true
    },
    originalUrl: {
        type: String,
        required: true
    },
    fullNewUrl: {
        type: String,
        required: true
    },
    newUrl: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true,
        default: 0
    },
    lastUsed: {
        type: Date,
        required: true,
        default: new Date()
    }
});

module.exports = mongoose.model('cors_urls', corsUrls);