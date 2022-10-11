import express from "express";
import multer from 'multer';

import mongoose from "mongoose";

import {registerValidation, loginValidation, postCreateValidation} from "./validations/validations.js";

import checkAuth from "./utils/checkAuth.js";

import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';
import handleValidationErrors from "./utils/handleValidationErrors.js";

mongoose.connect(process.env.MONGODB_URI)
        .then(console.log("DB Ok"))
        .catch((err) => {console.log(err)} );

const app = express();

const storage = multer.diskStorage({
    destination: (_,__,cb) =>{
        cb(null, 'uploads');
    },
    filename: (_,file,cb) =>{
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.use(express.json());
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