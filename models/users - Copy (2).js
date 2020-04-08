const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var userSchema = new Schema({
	username:{
		type:String,
		required:true,
		validate:{
			validator:function(v){				
			const regex = /[^a-bA-B0-9]{4,10}/;
				return (v == null) || (regex.test(v));
			},
			message:props=>`${props.value} username should be alphanumaric and between 4,10 charactars`
		}
	},
	password:{type:String,required:true},
	token:{type:String},
	device:{type:String},
	lastLogin:{type:Date,default:Date.now}
});
const userModel = mongoose.model("users",userSchema);

module.exports = userModel;