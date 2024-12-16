const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    amount: {
        type: Number
    },
    status: {
        type: String,
    },
    date: {
        type: Date
    },
});

module.exports = mongoose.model('Payment', paymentSchema);