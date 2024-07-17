const mongoose = require("mongoose");

require("dotenv").config();

const mongoString = process.env.MONGO_STRING;

const connection = mongoose.createConnection(mongoString);

// Expose the connection
module.exports = connection;
