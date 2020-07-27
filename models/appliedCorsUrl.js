const mongoose = require('mongoose');

const appliedCorsUrlSchema = new mongoose.Schema({
    original: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('applied_cors_urls', appliedCorsUrlSchema);