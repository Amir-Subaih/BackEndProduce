const mongoose = require ('mongoose');
const Joi = require ('joi');

const FeedbackSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Users"
    },
    statement : {
        type : String ,
        required : true ,
        trim : true , 
        minlength : 5
    }
},{timestamps : true});


const Feedback = mongoose.model("Feedback",FeedbackSchema);


//function to validate the Create feedback
function validateCreateFeedback(obj){
    const schema = Joi.object({
        userId : Joi.string().required().trim(),
        statement : Joi.string().min(5).required().trim()
    });
    return schema.validate(obj);
}

//function to validate the Update feedback
function validateUpdateFeedback(obj){
    const schema = Joi.object({
        statement : Joi.string().min(5).trim()
    });
    return schema.validate(obj);
}

module.exports = {
    Feedback,
    validateCreateFeedback,
    validateUpdateFeedback
}

