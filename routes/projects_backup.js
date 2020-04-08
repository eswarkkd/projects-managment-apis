const express = require('express');
const router = express.Router();
const projectsModel = require('../models/projects');
const tokenAuth = require('../authentication/auth');
const path = require('path');
const fs = require("fs");


router.post('/',tokenAuth,(req,res,next)=>{
	try{
	projectsModel.find({},function(error,result){
		if(error){
			res.status(404).json({status:0,message:"fail",error:error});
		}else{
			if(result.length){
			res.status(200).json({status:1,message:"success",projects:result});
			}else{
				res.status(200).json({status:0,message:"fail",projects:[]});
			}
		}
	});
	}catch(error){
		res.status(404).json({status:0,message:"fail",error:error});
	}
});

router.post('/get_project',tokenAuth,(req,res,next)=>{
		try{
			projectsModel.findOne({_id:req.body.id},function(error,result){
			if(error){
				res.status(200).json({status:0,message:"fail",error:error});
			}else{
				if(result){
				res.status(200).json({status:1,message:"success",projects:result});
				}else{
				res.status(200).json({status:0,message:"success",projects:[]});		
				}
			}
			});
		}catch(error){
			res.status(404).json({error:error});
		}
});

router.post('/create_project',tokenAuth,(req,res,next)=>{
	var errors = "";
	try{
		var files=[];
			const imagesArray = [];
			const videosArray = [];
			
			if(req.files){
				
				if(Array.isArray(req.files.uploadfiles)===false){
					files.push(req.files.uploadfiles);
				}else{
					files = req.files.uploadfiles;
				}
				
				var imageErrors = "";
				var videoErrors = "";
				var ext ="";
				var extensions = ['.jpg','.jpeg','.gif','.png','.mpeg','.mp4'];
				// check file extesion
				files.forEach(function(element){
					ext = element.name;
					ext = path.extname(ext);					
					ext=ext.toLowerCase();
					
					if(!extensions.includes(ext)){
						
						errors = "supported formates for images only .jpg .png .gif and for videos .mp4, .mpeg";
					}
					
				});
		
		}
		
		if(errors){
			res.status(200).json({status:0,message:errors});
		}else{
			
				var filename = "";
				for(let i=0; i<files.length;i++){
					ext = path.extname(files[i].name);
					filename = (Math.ceil(Math.random()*1000)).toString()+Date.now()+"_"+i+path.extname(files[i].name);
					

					if(ext ==".jpg" || ext ==".jpeg" || ext ==".png" || ext ==".gif"){
					imagesArray.push(filename);	
					}
					
					if(ext ==".mp4" || ext ==".mpeg"){
					videosArray.push(filename);
					}
					files[i].mv('./uploades/'+filename,function(error){
					});
				}
			}
			
			
			const newProject = new projectsModel({title:req.body.title,description:req.body.description,images:imagesArray,videos:videosArray});
			try{
				newProject.save().then((result)=>{
					res.status(200).json({status:1,message:"Project successfully added"});
				}).catch((error)=>{
					res.status(200).json({status:0,message:"fail",error:error});
				});
			}catch(error){
				res.status(200).json({status:0,message:"fail",error:error});
			}
			

	}catch(error){
		res.status(404).json({status:0,message:"fail",error:error});
	}
			
	
});

router.post('/update_project',tokenAuth,async (req,res,next)=>{
	try{
		var files=[];
			const imagesArray = [];
			const videosArray = [];
			
			// add new images
			if(req.files){
				if(Array.isArray(req.files.uploadfiles)===false){
					files.push(req.files.uploadfiles);
				}else{
					files = req.files.uploadfiles;
				}
				var errors = "";
				var imageErrors = "";
				var videoErrors = "";
				var ext ="";
				var extensions = ['.jpg','.jpeg','.gif','.png','.mpeg','.mp4'];
				// check file extesion
				files.forEach(function(element){
					ext = element.name;
					ext = path.extname(ext);					
					ext=ext.toLowerCase();
					
					if(!extensions.includes(ext)){
						errors = "supported formates for images only .jpg .png .gif and for videos .mp4, .mpeg";
					}
				});

				if(errors){
					res.status(200).json({status:0,message:'fail',errors:[{imageErrors:errors}]});
				}
				
				var filename = "";
				for(let i=0; i<files.length;i++){
					ext = path.extname(files[i].name);
					filename = (Math.ceil(Math.random()*1000)).toString()+Date.now()+"_"+i+path.extname(files[i].name);
					

					if(ext ==".jpg" || ext ==".jpeg" || ext ==".png" || ext ==".gif"){
					imagesArray.push(filename);	
					}
					
					if(ext ==".mp4" || ext ==".mpeg"){
					videosArray.push(filename);
					}
					files[i].mv('./uploades/'+filename,function(error){
					});
				}
			}

			// get document with id
			if(req.body.id){
			var docResult = await new Promise(function(resolve,reject){
				
				projectsModel.findOne({_id:req.body.id},function(error,result){
					
					if(error){
						res.status(200).json({status:0,message:"document not found with give id",error:error});
					}else{
						return resolve(result);
					}
				});
	
			});
			
			var videos = [];
			var images = [];
			var removedImages = req.body.removedimages
				removedImages = removedImages.split('|');
			var removedVideos = req.body.removedvideos;
				removedVideos=removedVideos.split('|');
			var indexValue;

			// remove images
			if(removedImages.length){
				images = await docResult.images;	
				removedImages.forEach((element)=>{
					indexValue = images.indexOf(element);	
					if(indexValue !== -1){
						images.splice(indexValue,1);
						fs.exists('./uploades/'+element,function(exists){
							console.log(exists);
							if(exists){
								
								fs.unlink('./uploades/'+element,function(error){ });
							}
						});
					}
				});
			}
			
			// remove videos
			if(removedVideos.length){
				videos = await docResult.videos;	
				removedVideos.forEach((element)=>{
					indexValue = videos.indexOf(element);	
					if(indexValue !== -1){
						videos.splice(indexValue,1);
						fs.exists('./uploades/'+element,function(exists){
							console.log(exists);
							if(exists){
								
								fs.unlink('./uploades/'+element,function(error){ });
							}
						});
					}
				});
			}
			
			// concat new added images and removed images
			var AllImages = [];
			var AllVideos = [];
			
			if(imagesArray.length){
				AllImages = images.concat(imagesArray);
			}else{
				AllImages = images;
			}
			
			if(imagesArray.length){
				AllVideos = videos.concat(videosArray);
			}else{
				AllVideos = videos;
			}
			
			await console.log(AllImages);
			await console.log(AllVideos);
			// update document with id
			projectsModel.findOneAndUpdate({_id:req.body.id},{title:req.body.title,description:req.body.description,images:AllImages,videos:AllVideos},(error,result)=>{
					if(error){
						res.status(200).json({status:0,message:"error while update",error:error})		
					}else{
						res.status(200).json({status:1,message:"successfully updated"})		
					}
				});
			}
	}catch(error){
		res.status(404).json({error:error});
	}
			
	
});



router.post('/delete_project',tokenAuth,(req,res,next)=>{
	try{
		projectsModel.remove({_id:req.body.id},function(error){
			if(error){
				res.status(200).json({status:0,message:"fail",error:error});
			}else{
				res.status(200).json({status:1,message:"success"});
			}
		});
	}catch(error){
		res.status(404).json({error:error});
	}
});


module.exports = router;