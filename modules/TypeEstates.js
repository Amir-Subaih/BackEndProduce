const Joi = require ('joi');


const LandStoreEstate = Joi.object({
    ownerId : Joi.string().required().trim(),
    address : Joi.string().min(3).max(23).required().trim(),
    description : Joi.string().min(3).required().trim(),
    price : Joi.number().min(0).required(),
    imageUrl : Joi.string(),
    area : Joi.number().required().min(0),
    typeEstateSR : Joi.string().required().valid("Sale", "Rent","بيع","ايجار"),
    typeEstates : Joi.string().required().valid("House", "Apartment", "Store","Chalet", "Land","منزل","ارض","شاليه","شقة","مخزن")
});

const HouseChaletApartmentEstate = Joi.object({
    ownerId : Joi.string().required().trim(),
    address : Joi.string().min(3).max(23).required().trim(),
    description : Joi.string().min(3).required().trim(),
    price : Joi.number().min(0).required(),
    imageUrl : Joi.string(),
    area : Joi.number().required().min(0),
    typeEstateSR : Joi.string().required().valid("Sale", "Rent","بيع","ايجار"),
    typeEstates : Joi.string().required().valid("House", "Apartment", "Store","Chalet", "Land","منزل","ارض","شاليه","شقة","مخزن"),
    bedrooms : Joi.number().min(0).required(),
    bathrooms : Joi.number().min(0).required()
});

/*
const BuildingEstate = Joi.object({
    ownerId : Joi.string().required().trim(),
    address : Joi.string().min(3).max(23).required().trim(),
    description : Joi.string().min(3).required().trim(),
    price : Joi.number().min(0).required(),
    imageUrl : Joi.string(),
    area : Joi.number().required().min(0),
    numberOfApartments : Joi.number().min(0).required(),
    numberOfFloor : Joi.number().min(0).required(),
    typeEstateSR : Joi.string().required().valid("Sale", "Rent"),
    typeEstates : Joi.string().required().valid("House", "Apartment", "Store","Chalet", "Land", "Building")
});
*/

module.exports = {
    LandStoreEstate,
    HouseChaletApartmentEstate
    //BuildingEstate
};
