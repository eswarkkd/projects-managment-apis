const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userSchema = new Schema({
	username:{
		type:String,
		required:[true,"Username is required field"],
		unique:true
	},
	password:{type:String,required:[true,"Password is required field"]},
	token:{type:String},
	device:{type:String},
	lastLogin:{type:Date,default:Date.now}
});

function usernameValidate(value){
	const regexPattern = /[^a-bA-B0-9]{4,10}/;
	return regexPattern.test(value);
}
const userModel = mongoose.model("users",userSchema);

module.exports = userModel;