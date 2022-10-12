import {} from 'dotenv/config'
import express from "express";
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';


import mongoose from "mongoose";

import {registerValidation, loginValidation, postCreateValidation} from "./validations/validations.js";

import checkAuth from "./utils/checkAuth.js";

import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';
import handleValidationErrors from "./utils/handleValidationErrors.js";

const URI = process.env.MONGODB_URI || "mongodb+srv://admin:admin122@cluster0.5lp5lkv.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("Error", err));

const app = express();

const storage = multer.diskStorage({
    destination: (_,__,cb) =>{
        if(!fs.existsSync('uploads')){
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_,file,cb) =>{
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.use(express.json());
app.use(cors());
app.use('/uploads',express.static('uploads'));

app.get('/', (req,res) => {
    res.send("Hello");
});

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/user', checkAuth, UserController.getUser);

app.post('/upload', checkAuth, upload.single('image'), (req,res) =>{
    res.json({
        url:`/uploads/${req.file.originalname}`,
    });
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id',checkAuth, PostController.remove);
app.patch('/posts/:id',checkAuth, handleValidationErrors, PostController.update);


app.listen(process.env.PORT || 4444, (err) => {
    if(err){
        return err;
    }
    console.log("Server Ok");
});