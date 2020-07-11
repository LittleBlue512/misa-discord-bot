var mongoose = require('mongoose');
var dotenv = require('dotenv');
var Schema = mongoose.Schema;

dotenv.config();

// Connection
var mongoUri = process.env.DATABASE_STRING;
var connection = mongoose.createConnection(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })

// Models
var CommandSchema = new Schema({
    key: {
        type: String,
        required: true,
    },
    response: {
        type: String,
        required: true
    }
});

connection.model('Command', CommandSchema);

module.exports = connection;