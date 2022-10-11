import { body } from "express-validator";

export const registerValidation = [
    body('email', "Invalid email").isEmail(),
    body('password', "Invalid password").isLength({min:7}),
    body('name', "Invalid name").isLength({min:3}),
    body('avatarUrl').optional().isURL(),
]
export const loginValidation = [
    body('email', "Invalid email").isEmail(),
    body('password', "Invalid password").isLength({min:7}),
]
export const postCreateValidation = [
    body('title', "Enter a title").isLength({min:3}).isString(),
    body('text', "Enter a text").isLength({min:10}).isString(),
    body('tags', 'Incorrect format of tags').optional().isString(),
    body('imageUrl','Incorrect link to the image').optional().isString(),
]