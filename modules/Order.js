const mongoose = require('mongoose');
const Joi = require('joi');

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    orderArray: [
        {
            producerId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Producers"
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            size: {
                type: String,
                required: true,
                trim: true
            },
            color: {
                type: String,
                required: true,
                trim: true
            }
        }
    ],
    sumPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ["معلقة" , "مقبولة" , "مرفوضة", "سلمت"],
        default: "معلقة"
    }
}, { timestamps: true });

// Model Order
const Order = mongoose.model("Order", OrderSchema);

// Validate Order to create
function validateCreateOrder(obj) {
    const schema = Joi.object({
        userId: Joi.string().trim().required(),
        orderArray: Joi.array().items(Joi.object({
            producerId: Joi.string().trim().required(),
            quantity: Joi.number().min(1).required(),
            size: Joi.string().trim().required(),
            color: Joi.string().trim().required()
        })).required(),
        sumPrice: Joi.number().min(0).required(),
        status: Joi.string().valid("معلقة" , "مقبولة" , "مرفوضة", "سلمت").default("معلقة")

    });

    return schema.validate(obj);
}

// Validate Order to update
function validateUpdateOrder(obj) {
    const schema = Joi.object({
        orderArray: Joi.array().items(Joi.object({
            producerId: Joi.string().trim().required(),
            quantity: Joi.number().min(1).required(),
            size: Joi.string().trim().required(),
            color: Joi.string().trim().required(),
            _id: Joi.string().optional() // Allow _id field
        })),
        sumPrice: Joi.number().min(0),
        status: Joi.string().valid("معلقة" , "مقبولة" , "مرفوضة", "سلمت")
    });

    return schema.validate(obj);
}


// Export Module
module.exports = {
    Order,
    validateCreateOrder,
    validateUpdateOrder
};
