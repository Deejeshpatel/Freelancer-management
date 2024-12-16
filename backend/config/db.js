const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://parun9097:9XDO9oZGhS648OPR@cluster0.inazn.mongodb.net/freelancer");
        console.log('Mongodb Connected Successfully');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;