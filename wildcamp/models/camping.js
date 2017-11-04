var mongoose = require("mongoose");

var campingSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	lat: String,
	lng: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});


module.exports = mongoose.model("Camping", campingSchema);