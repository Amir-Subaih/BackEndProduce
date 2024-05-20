const mongoose = require ('mongoose');
const Joi = require ('joi');

const ProducerSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    name: {
        type: String, 
        required: true,
        trim: true,
        minlength: 3
    },
    description: {
        type: String, // corrected from Type to type
        required: true,
        trim: true,
        minlength: 3
    },
    price: {
        type: Number, // corrected from Type to type
        required: true,
        trim: true,
        min: 0
    },
    imageUrl : {
        type : [String],
        required : true
   },
   size : {
       type : String,
       required : true,
       trim: true,
       min: 1
   }
}, { timestamps: true });


// Model Producer
const Producer = mongoose.model("Producer" , ProducerSchema);


// Validate Estate to create
function validateCreateProducer(obj){

    const schema = Joi.object({
        ownerId : Joi.string().required().trim(),
        name : Joi.string().min(3).required().trim(),
        description : Joi.string().min(3).required().trim(),
        price : Joi.number().min(0).required(),
        imageUrl : Joi.string(),
        size : Joi.string().required().trim()
    });

    return schema.validate(obj);
    

}

// Validate Producer to update
function validateUpdateProducer(obj){
    const schema = Joi.object({
        ownerId : Joi.string().trim(),
        name : Joi.string().min(3).trim(),
        description : Joi.string().min(3).trim(),
        price : Joi.number().min(0),
        imageUrl : Joi.string(),
        size : Joi.string().required().trim()
    });
    return schema.validate(obj);
}


// Export Module
module.exports = {
    Producer,
    validateCreateProducer,
    validateUpdateProducer
}
