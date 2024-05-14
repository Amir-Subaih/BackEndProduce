const mongoose = require ('mongoose');
const Joi = require ('joi');

const ProducerSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
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
   typeProducer : {
       type : String,
       required : true,
       enum : ["الجوالات", "اللابتوبات", "أجهزه للارتداء","السماعات", "الأثاث","الأحذیه الریاضیه","الساعات" , "قرطاسیه", "أزیاء نسائیه","أزیاء رجالیه","ملابس ریاضیه" , "النظافه"]
   }
}, { timestamps: true });


// Model Producer
const Producer = mongoose.model("Producer" , ProducerSchema);


// Validate Estate to create
function validateCreateProducer(obj){

    const schema = Joi.object({
        ownerId : Joi.string().required().trim(),
        description : Joi.string().min(3).required().trim(),
        price : Joi.number().min(0).required(),
        imageUrl : Joi.string(),
        typeEstates : Joi.string().required().valid("الجوالات", "اللابتوبات", "أجهزه للارتداء","السماعات", "الأثاث","الأحذیه الریاضیه","الساعات" , "قرطاسیه", "أزیاء نسائیه","أزیاء رجالیه","ملابس ریاضیه" , "النظافه")
    });

    return schema.validate(obj);
    

}

// Validate Producer to update
function validateUpdateProducer(obj){
    const schema = Joi.object({
        ownerId : Joi.string().trim(),
        description : Joi.string().min(3).trim(),
        price : Joi.number().min(0),
        imageUrl : Joi.string(),
        typeProducers : Joi.string().valid("الجوالات", "اللابتوبات", "أجهزه للارتداء","السماعات", "الأثاث","الأحذیه الریاضیه","الساعات" , "قرطاسیه", "أزیاء نسائیه","أزیاء رجالیه","ملابس ریاضیه" , "النظافه")
    });
    return schema.validate(obj);
}


// Export Module
module.exports = {
    Producer,
    validateCreateProducer,
    validateUpdateProducer
}
