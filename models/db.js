const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    app: {
        type: String,
        required: true,
    },
    section: {
        type: String,
    },
    subsection: {  // Add subsection field
        type: String,
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('logs', LogSchema);
