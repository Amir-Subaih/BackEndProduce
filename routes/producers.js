const express = require('express');
const router = express.Router();
const { createProducer,GetAllProducers
        ,GetProducerById,UpdateProducer,
        DeleteProducer/*,GetEstateByOwnerId,
        GetByTypeEstates */} = require('../controllers/producerController');
const { /*verifyTokenAndCreateUser,*/verifyTokenAndAdmin
        ,verifyTokenAndAuthorization 
        ,verifyTokenAndAdminAndOwner } = require('../middleware/verify');
const cloudinary = require('cloudinary').v2
const multer = require('multer');

cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
      });
    
      // Configure Multer for file upload
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });


//function to validate Create Estate
router
        .route('/create')
        .post( upload.array('images', 20) ,verifyTokenAndAdmin,createProducer);

 // function for Retern All Producer for Admin
router 
        .route('/')
        .get(GetAllProducers);

// function for Retern Producer for website By id
router
        .route('/:id')
        .get(GetProducerById)
        .put(upload.array('images', 20) ,verifyTokenAndAdmin,UpdateProducer)
        .delete(verifyTokenAndAdmin,DeleteProducer);

/*

// function for Retern All Estates for Admin
router 
        .route('/')
        .get(verifyTokenAndAdmin,GetAllEstates);//Done


// function for Retern All Estates for website
router
        .route('/all')
        .get(GetAllEstates);
// function for Retern All Estates for website
router
        .route('/house')
        .get(GetAllEstates);//GetByTypeEstates
// function for Retern All Estates for website
router
        .route('/all/:id')
        .get(GetEstateById);

// function for Retern Estate by Id (only for Admin)
// function for Update Estate by Owner Or Admin

router
        .route('/:id')
        .get(verifyTokenAndAdmin,GetEstateById)//Done
        .put(upload.array('images', 20) ,verifyTokenAndAdminAndOwner,UpdateEstate)//Done
        .delete(verifyTokenAndAdminAndOwner,DeleteEstate);//Done

// function for Retern All Estates by ownerId
router
        .route('/owner/:id')
        .get(verifyTokenAndAuthorization,GetEstateByOwnerId);
*/


module.exports = router;
