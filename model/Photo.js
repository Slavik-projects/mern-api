const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const photoSchema = new Schema({
	firstname: String,
	lastname: String,
	image: String
});

module.exports = mongoose.model('Photo', photoSchema)