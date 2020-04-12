const express = require('express');
const router = express.Router();
const users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenAuth = require('../authentication/auth');

router.post('/user_login',(req,res)=>{
	try{
		users.findOne({username:req.body.username},async (error,result)=>{
			if(error){
				res.status(404).json({error:error});
			}else{
				if(result){
					const username  = result.username;
					// token
					const token = jwt.sign({id:result._id,username:result.admin},'salt_string123',{expiresIn:"2 days"});
					
					bcrypt.compare(req.body.password,result.password,(error,result)=>{
						res.status(200).json({status:1,message:"success",token:token,username:username});	
					});
				}else{
					res.status(200).json({status:0,message:"wrong credentials"});
				}
			}
		});
	}catch(error){
		res.status(404).json({status:0,message:"fail",errors:error});
		console.log("Error:Login rout error");
	}
});

router.post('/create_user',async (req,res)=>{
	try{
		const usersSchema = new users();
		var hashPassword = "";
		
		// password hash
		hashPassword = await new Promise((resolve,reject)=>{
			bcrypt.hash(req.body.password,10,(error,result)=>{ 
			if(error){
				console.log("hash password error");
				reject("");
			}else{	
				resolve(result);
			}			
			});
		});

		usersSchema.username=req.body.username;
		usersSchema.password=hashPassword;

		usersSchema.save().then((result)=>{ 
			res.status(200).json({status:1,message:"success"}); 
		}).catch((error)=>{
			res.status(200).json({status:0,message:"fail",error:error}); 
		});
		
	}catch(e){
		res.status(404).json({status:0,message:"fail",errors:error});
		console.log("Error:create_user router error");
	}
});
router.post('/',tokenAuth,(req,res)=>{
	try{
		users.findOne({username:req.body.username},async (error,result)=>{
			if(error){
				res.status(200).json({status:0,message:"fail",errors:error});
			}else{
				if(result){
					res.status(200).json({status:1,message:"success",result:result});	
					
				}else{
					res.status(200).json({status:0,message:"fail",result:result});
				}
			}
		});
	}catch(error){
		res.status(404).json({status:0,message:"fail",errors:error});
	}
})


module.exports = router;