const express = require('express');
const body_parser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
app.use(cors());

app.use(fileUpload());
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended:true}));
app.use('/uploades/',express.static(path.join(__dirname,'/uploades')));
mongoose.connect(process.env.DATABASE_URI,{useNewUrlParser:true,useUnifiedTopology:true},(error)=>{ if(error){ console.log("Database error."); }else{ console.log("Database connected."); } });

// routes
const users = require('./routes/users');
const projects = require('./routes/projects');


app.use('/users',users);
app.use('/projects',projects);

app.listen(process.env.SERVER_PORT,()=>{ console.log("server has been started @ "+process.env.SERVER_PORT); console.log('Database is connect ...');  });
