const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var userSchema = new Schema({
	username:{
		type:String,
		validate:{
			validator:function(v){				
			const regex = /[^a-bA-B0-9]{4,10}/;
				return (v == null | v.trim().length < 1) || regex.test(v);
			},
			message:props=>`${props.value} username should be alphanumaric and between 4,10 charactars`
		}
	},
	password:{type:String},
	token:String,
	device:String,
	lastLogin:{type:Date,default:Date.now}
});
const userModel = mongoose.model("users",userSchema);

module.exports = userModel;