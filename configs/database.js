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

var StaffSchema = new Schema({
    username: {
        type: String,
        required: true
    }
});

var CleanChatPrefixSchema = new Schema({
    prefix: {
        type: String,
        required: true
    }
});

connection.model('CleanChatPrefix', CleanChatPrefixSchema);
connection.model('Kanji', KanjiSchema);
connection.model('Staff', StaffSchema);

module.exports = connection;