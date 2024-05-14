const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const jpc = require('joi-password-complexity');


// User Schema
const UserSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        minlength : 13,
        maxlength : 255,
    },
    name : {
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 255,
    },
    password :{
        type : String,
        required : true,
        trim : true,
        minlength : 8,
    },
    confirm_password :{
        type : String,
        required : true,
        trim : true,
        minlength : 8,
    },
    phone:{
        type: String,
        required: true,
        minlength: 10,
        maxlength: 15,
        trim: true
    },
    location:{
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    isAdmin : {
        type : Boolean,
        default : false,
    },
    ratings: [
        {
            value: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            ratedBy: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Users'
            }
        }
    ],
    totalRatings: {
        type: Number,
        default: 0
    }
}, {timestamps : true});

// Generate Token
UserSchema.methods.generateToken = function (){
return jwt.sign({id : this._id, isAdmin : this.isAdmin}, process.env.JWR_SECRET);
}

// User Model
const User = mongoose.model('Users', UserSchema);


//function to validate Register
function validateRegister(obj){
    const schema = Joi.object({
        email : Joi.string().min(13).max(255).required().email().trim(),
        name : Joi.string().min(3).max(255).required().trim(),
        password : jpc().required(),
        confirm_password : jpc().required(),
        phone : Joi.string().min(10).max(15).required().trim(),
        location : Joi.string().min(1).required().trim(),
    });
    return schema.validate(obj);
}

//function to validate Login
function validateLogin(obj){
    const schema = Joi.object({
        email : Joi.string().min(13).max(255).required().email().trim(),
        password : Joi.string().min(8).required().trim(),
    });
    return schema.validate(obj);
}

//function to validate Reset Password the user
function validateResetPassword(obj){
    const schema = Joi.object({
        password : jpc().required(),
    });
    return schema.validate(obj);
}

//function to validate update the user
function validateUpdatUser(obj){
    const schema = Joi.object({
        email : Joi.string().min(13).max(255).email().trim(),
        name : Joi.string().min(3).max(255).trim(),
        phone : Joi.string().min(10).max(15).trim(),
        location : Joi.string().min(1).required().trim(),
        password : jpc(),
    });
    return schema.validate(obj);
}

//Export User Model
module.exports = {
    User,
    validateRegister,
    validateLogin,
    validateUpdatUser,
    validateResetPassword,
};
