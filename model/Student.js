const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
   username: {
      required: true,
		type: String
	},
	password: {
      required: true,
		type: String
	},
	roles: {
      User: {
			type: Number,
			//default: 1923
		},
      Editor: Number,
		Admin: Number
	},
	refreshToken: [String]
});

module.exports = mongoose.model('Student', studentSchema)