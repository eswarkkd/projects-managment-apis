const jwtAuth = require("jsonwebtoken"); 
module.exports = (req,res,next)=>{
	
	var token = req.headers.authentication;
	try{
		jwtAuth.verify(token,'salt_string123');
		req.validToken=true;
		next();
	}catch(error){
		res.status(404).json({error:"Authentication fail"});
	}
	
	//jwtAuth.verify(req.body.authentication);
}