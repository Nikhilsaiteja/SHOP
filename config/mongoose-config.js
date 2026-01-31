const mongoose = require('mongoose');
const config = require('./environment');

const dbgr = require('debug')('app:mongoose');

const connectDB = async () => {
    try {
        dbgr(`Connecting to MongoDB in ${config.env} environment`);
        await mongoose.connect(config.database.uri);
        dbgr('Connected to MongoDB successfully');
    } catch (error) {
        dbgr('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

module.exports = connectDB;