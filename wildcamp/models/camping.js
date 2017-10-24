var mongoose = require("mongoose");

var campingSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

module.exports = mongoose.model("Camping", campingSchema);