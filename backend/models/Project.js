const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    duedate: {
        type: Date
    },
    status: {
        type: String,
        default: 'active'
    }
});

module.exports = mongoose.model('Project', projectSchema);