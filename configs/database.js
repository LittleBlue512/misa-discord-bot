var mongoose = require('mongoose');
var dotenv = require('dotenv');
var Schema = mongoose.Schema;

dotenv.config();

// Connection
var mongoUri = process.env.DATABASE_STRING;
var connection = mongoose.createConnection(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })

// Models
var KanjiSchema = new Schema({
    character: {
        type: String,
        required: true
    }
});

connection.model('Kanji', KanjiSchema);

module.exports = connection;