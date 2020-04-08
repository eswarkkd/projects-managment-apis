const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const projectsSchema = new Schema({
	title:{
		type:String,
		required:[true,"Title is required field"]
	},
	description:{
		type:String,
		required:[true,"Descriptions is required field"]
	},
	images:[String],
	videos:[String]
});
const projectsModel = mongoose.model("projects",projectsSchema);
module.exports=projectsModel;