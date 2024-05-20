const asyncHandler = require('express-async-handler');
const { Producer, validateCreateProducer , validateUpdateProducer } = require('../modules/Producer');
const { User } = require('../modules/User');
const cloudinary = require('cloudinary').v2

/**
 * @desc    Create a new producer
 * @route   POST /api/producer/create
 * @method  POST
 * @access  Private
 */

module.exports.createProducer = asyncHandler(async (req, res) => {
    // Validate request body
    const {error} = validateCreateProducer(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const user = await User.find({_id:req.body.ownerId});

    if (user == null){
        return res.status(400).json({message : 'User not found'});
    }

    const uploadedImages = [];
        // Iterate through uploaded files
        for (const file of req.files) {
            // Convert buffer to data URL
            const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            // Upload data URL to Cloudinary
            const re = await cloudinary.uploader.upload(dataUrl, { folder: 'Produces' });
            uploadedImages.push(re.secure_url);
        }

    const producer = new Producer({
        ownerId : req.body.ownerId,
        name : req.body.name,
        description : req.body.description,
        price : req.body.price,
        size : req.body.size,
        imageUrl : uploadedImages
    });

    const result = await producer.save();
    if (result) {
        res.status(201).json({result,message : 'success'});
    } else {
        res.status(500).json({message : 'Producer not created'});
    }


});


/**
 * @desc    Get All producer
 * @route   GET /api/producer
 * @method  GET
 * @access  Public
 */

module.exports.GetAllProducers = asyncHandler (async (req, res) => {

    let producers;
        producers = await Producer.find().sort({ createdAt: -1 });
    if (producers) {
        res.status(200).json({producers , "message" : "success"});
    } else {
        res.status(404).json({message : 'No Producers found'},error);
    }
});

/**
 * @desc    Get All producer
 * @route   GET /api/producer
 * @method  GET
 * @access  Public "Off"
 */

module.exports.SearchProducers = asyncHandler (async (req, res) => {

    let estates;
    const {maxprice,minprice,cityName} = req.query;
    const {pageNumber} = req.query;
    const {SR} = req.query;
    const {typeEatateS} = req.query;
    const {maxarea,minarea} = req.query;

    if(typeEatateS){
        if(pageNumber){
            const estatePerPage = 4;
            estates = await Estate.find({
                typeEstates :{$in :[typeEatateS]}})
            .populate("ownerId",[
                "_id",
                "email",
                "name",
                "phone"
            ]).skip((pageNumber - 1) * estatePerPage)
            .limit(estatePerPage)
            .sort({ createdAt: -1 });
        }else if (cityName){
            if(maxprice && minprice){
                if (SR){
                    if (maxarea && minarea){
                        // Display estates by price and city and SR and area
                        estates = await Estate.find({
                            price :{$gte:minprice , $lte:maxprice},
                            address : {$in :[cityName]},
                            typeEstates :{$in :[typeEatateS]},
                            typeEstateSR :{$in :[SR]},
                            area :{$gte:minarea , $lte:maxarea}
                        })
                        .populate("ownerId",[
                            "_id",
                            "email",
                            "name",
                            "phone"
                        ])
                        .sort({ createdAt: -1 });

                    } else{// Display estates by price and city and SR
                    estates = await Estate.find({
                        price :{$gte:minprice , $lte:maxprice},
                        address : {$in :[cityName]},
                        typeEstates :{$in :[typeEatateS]},
                        typeEstateSR :{$in :[SR]}
                    })
                    .populate("ownerId",[
                        "_id",
                        "email",
                        "name",
                        "phone"
                    ])
                    .sort({ createdAt: -1 });}

                }else{// Display estates by price and city
                estates = await Estate.find({
                    price :{$gte:minprice , $lte:maxprice},
                    address : {$in :[cityName]},
                    typeEstates :{$in :[typeEatateS]}
                })
                .populate("ownerId",[
                    "_id",
                    "email",
                    "name",
                    "phone"
                ])
                .sort({ createdAt: -1 });}

            } else{// Display estates by city
            estates = await Estate.find({
                address : {$in :[cityName]},
                typeEstates :{$in :[typeEatateS]}
            })
            .populate("ownerId",[
                "_id",
                "email",
                "name",
                "phone"
            ])
            .sort({ createdAt: -1 });}

        }else if (maxprice && minprice){
            if(SR){
                if (maxarea && minarea){
                    // Display estates by price and SR and area
                    estates = await Estate.find({
                        price :{$gte:minprice , $lte:maxprice},
                        typeEstates :{$in :[typeEatateS]},
                        typeEstateSR :{$in :[SR]},
                        area :{$gte:minarea , $lte:maxarea}
                    })
                    .populate("ownerId",[
                        "_id",
                        "email",
                        "name",
                        "phone"
                    ])
                    .sort({ createdAt: -1 });

                } else{// Display estates by price and SR
                estates = await Estate.find({
                    price :{$gte:minprice , $lte:maxprice},
                    typeEstates :{$in :[typeEatateS]},
                    typeEstateSR :{$in :[SR]}
                })
                .populate("ownerId",[
                    "_id",
                    "email",
                    "name",
                    "phone"
                ])
                .sort({ createdAt: -1 });}

            } else{// Display estates by price
            estates = await Estate.find({
                price :{$gte:minprice , $lte:maxprice},
                typeEstates :{$in :[typeEatateS]}})
            .populate("ownerId",[
                "_id",
                "email",
                "name",
                "phone"
            ])
            .sort({ createdAt: -1 });}

        }else if (SR){
            if(maxarea && minarea){
                // Display estates by SR and area
                estates = await Estate.find({
                    typeEstateSR :{$in :[SR]},
                    typeEstates :{$in :[typeEatateS]},
                    area :{$gte:minarea , $lte:maxarea}
                })
                .populate("ownerId",[
                    "_id",
                    "email",
                    "name",
                    "phone"
                ])
                .sort({ createdAt: -1 });

            } else{// Display estates by SR
            estates = await Estate.find({
                typeEstateSR :{$in :[SR]},
                typeEstates :{$in :[typeEatateS]}})
            .populate("ownerId",[
                "_id",
                "email",
                "name",
                "phone"
            ])
            .sort({ createdAt: -1 });}
            
        }else if(maxarea && minarea){
            // Display estates by area
            estates = await Estate.find({
                area :{$gte:minarea , $lte:maxarea},
                typeEstates :{$in :[typeEatateS]}})
            .populate("ownerId",[
                "_id",
                "email",
                "name",
                "phone"
            ])
            .sort({ createdAt: -1 });

        } else{
            estates = await Estate.find({
                typeEstates :{$in :[typeEatateS]}})
            .populate("ownerId",[
                "_id",
                "email",
                "name",
                "phone"
            ])
            .sort({ createdAt: -1 });
        }
    }else if(pageNumber){
        // Display estates by pagination
        const estatePerPage = 4;
        estates = await Estate.find().populate("ownerId",[
            "_id",
            "email",
            "name",
            "phone"
        ]).skip((pageNumber - 1) * estatePerPage)
        .limit(estatePerPage)
        .sort({ createdAt: -1 });
    }else if (cityName){
        if(maxprice && minprice){
            if (SR){
                if (maxarea && minarea){
                    // Display estates by price and city and SR and area
                    estates = await Estate.find({
                        price :{$gte:minprice , $lte:maxprice},
                        address : {$in :[cityName]},
                        typeEstateSR :{$in :[SR]},
                        area :{$gte:minarea , $lte:maxarea}
                    })
                    .populate("ownerId",[
                        "_id",
                        "email",
                        "name",
                        "phone"
                    ])
                    .sort({ createdAt: -1 });

                } else{// Display estates by price and city and SR
                estates = await Estate.find({
                    price :{$gte:minprice , $lte:maxprice},
                    address : {$in :[cityName]},
                    typeEstateSR :{$in :[SR]}
                })
                .populate("ownerId",[
                    "_id",
                    "email",
                    "name",
                    "phone"
                ])
                .sort({ createdAt: -1 });}

            }else{// Display estates by price and city
            estates = await Estate.find({
                price :{$gte:minprice , $lte:maxprice},
                address : {$in :[cityName]}
            })
            .populate("ownerId",[
                "_id",
                "email",
                "name",
                "phone"
            ])
            .sort({ createdAt: -1 });}

        }else if(SR){
            if (maxarea && minarea){
                // Display estates by city and SR and area
                estates = await Estate.find({
                    address : {$in :[cityName]},
                    typeEstateSR :{$in :[SR]},
                    area :{$gte:minarea , $lte:maxarea}
                })
                .populate("ownerId",[
                    "_id",
                    "email",
                    "name",
                    "phone"
                ])
                .sort({ createdAt: -1 });

            } else{// Display estates by city and SR
            estates = await Estate.find({
                address : {$in :[cityName]},
                typeEstateSR :{$in :[SR]}})
            .populate("ownerId",[
                "_id",
                "email",
                "name",
                "phone"
            ])
            .sort({ createdAt: -1 });}
        }else if(maxarea && minarea){
            // Display estates by city and area
            estates = await Estate.find({
                address : {$in :[cityName]},
                area :{$gte:minarea , $lte:maxarea}
            })
            .populate("ownerId",[
                "_id",
                "email",
                "name",
                "phone"
            ])
            .sort({ createdAt: -1 });

        } else{// Display estates by city   
        estates = await Estate.find({
            address : {$in :[cityName]}}).populate("ownerId",[
                "_id",
                "email",
                "name",
                "phone"
            ]).sort({ createdAt: -1 });
        }
    }else if (maxprice && minprice){
        if(SR){
            if (maxarea && minarea){
                // Display estates by price and SR and area
                estates = await Estate.find({
                    price :{$gte:minprice , $lte:maxprice},
                    typeEstateSR :{$in :[SR]},
                    area :{$gte:minarea , $lte:maxarea}
                })
                .populate("ownerId",[
                    "_id",
                    "email",
                    "name",
                    "phone"
                ])
                .sort({ createdAt: -1 });

            } else{// Display estates by price and SR
            estates = await Estate.find({
                price :{$gte:minprice , $lte:maxprice},
                typeEstateSR :{$in :[SR]}})
            .populate("ownerId",[
                "_id",
                "email",
                "name",
                "phone"
            ])
            .sort({ createdAt: -1 });}
        }else if(maxarea && minarea){
            // Display estates by price and area
            estates = await Estate.find({
                price :{$gte:minprice , $lte:maxprice},
                area :{$gte:minarea , $lte:maxarea}
            })
            .populate("ownerId",[
                "_id",
                "email",
                "name",
                "phone"
            ])
            .sort({ createdAt: -1 });

        }else{
            // Display estates by price
            estates = await Estate.find({
                price :{$gte:minprice , $lte:maxprice}})
            .populate("ownerId",[
                "_id",
                "email",
                "name",
                "phone"
            ])
            .sort({ createdAt: -1 });
        }

    }else if (SR){
        if(maxarea && minarea){
            // Display estates by SR and area
            estates = await Estate.find({
                typeEstateSR :{$in :[SR]},
                area :{$gte:minarea , $lte:maxarea}
            })
            .populate("ownerId",[
                "_id",
                "email",
                "name",
                "phone"
            ])
            .sort({ createdAt: -1 });
        }else{
            // Display estates by SR
            estates = await Estate.find({
                typeEstateSR :{$in :[SR]}})
            .populate("ownerId",[
                "_id",
                "email",
                "name",
                "phone"
            ])
            .sort({ createdAt: -1 });
        }
        
    }else if(maxarea && minarea){
        // Display estates by area
        estates = await Estate.find({
            area :{$gte:minarea , $lte:maxarea}})
        .populate("ownerId",[
            "_id",
            "email",
            "name",
            "phone"
        ])
        .sort({ createdAt: -1 });

    } else {
        // Display all estates
        estates = await Estate.find().populate("ownerId",[
            "_id",
            "email",
            "name",
            "phone"
        ])
        .sort({ createdAt: -1 });
    }
    if (estates) {
        res.status(200).json({estates , "message" : "success"});
    } else {
        res.status(404).json({message : 'No estate found'},error);
    }
});

/**
 * @desc    Get All estate
 * @route   GET /api/estate
 * @method  GET
 * @access  Private (only admin can access this route)
 */

module.exports.GetByTypeEstates = asyncHandler (async (req, res) => {

    let estates1;
    const {pageNumber} = req.query;
    const {typeEatateS} = req.query;

    if(typeEatateS){
        if(pageNumber){
            const estatePerPage = 4;
            estates1 = await Estate.find({
                typeEstates :{$in :[typeEatateS]}})
            .populate("ownerId",[
                "_id",
                "email",
                "name",
                "phone"
            ]).skip((pageNumber - 1) * estatePerPage)
            .limit(estatePerPage)
            .sort({ createdAt: -1 });
        }else{
            estates1 = await Estate.find({
                typeEstates :{$in :[typeEatateS]}})
            .populate("ownerId",[
                "_id",
                "email",
                "name",
                "phone"
            ])
            .sort({ createdAt: -1 });
        }
    }else 
    
    {
        // Display all estates
        estates1 = await Estate.find().populate("ownerId",[
            "_id",
            "email",
            "name",
            "phone"
        ])
        .sort({ createdAt: -1 });
}
    if (estates1) {
        res.status(200).json({estates1 , "message" : "success1"});
    } else {
        res.status(404).json({message : 'No estate found'});
    }
});

/**
 * @desc    Get estate by id
 * @route   GET /api/estate/:id
 * @method  GET
 * @access  Privet (only admin can access this route)
 */

module.exports.GetEstateById = asyncHandler (async (req, res) => {
    const estate = await Estate.findById(req.params.id).populate("ownerId",[
        "_id",
        "email",
        "name",
        "phone"
    ]);
    if (estate) {
        res.status(200).json({estate , "message" : "success"});
    } else {
        res.status(404).json({message : 'Estate not found'});
    }
});

/**
 * @desc    Get estate by ownerId
 * @route   GET /api/estate/owner/:id
 * @method  GET
 * @access  Privet (only admin can access this route and the owner of the estate)
 */

module.exports.GetEstateByOwnerId = asyncHandler (async (req, res) => {
    const estate = await Estate.find({ownerId:req.params.id});
    if (estate) {
        res.status(200).json({estate , "message" : "success"});
    } else {
        res.status(404).json({message : 'Estate not found For Owner'});
    }
});

/**
 * @desc    Update estate by id
 * @route   PUT /api/estate/:id
 * @method  PUT
 * @access  Privet (only admin can access this route And the owner of the estate)
 */

module.exports.UpdateEstate = asyncHandler (async (req, res) => {
    // Validate request body
    const {error} = validateUpdateEstate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const uploadedImages = [];
        // Iterate through uploaded files
        if (req.files && req.files.length > 0) 
            {for (const file of req.files) {
                    // Convert buffer to data URL
                    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                    // Upload data URL to Cloudinary
                    const re = await cloudinary.uploader.upload(dataUrl, { folder: 'uploads' });
                    uploadedImages.push(re.secure_url);
                }
            }

    const estate = await Estate.findByIdAndUpdate(req.params.id,{
        $set : {
            ownerId : req.body.ownerId,
            address : req.body.address,
            typeEstateSR : req.body.typeEstateSR,
            description : req.body.description,
            price : req.body.price,
            typeEstates : req.body.typeEstates,
            area : req.body.area,
            bedrooms : req.body.bedrooms,
            bathrooms : req.body.bathrooms,
            //imageUrl : uploadedImages
        }
    },{new : true});
    res.status(200).json({estate , "message" : "success"});
});

/**
 * @desc    Delete estate by id
 * @route   DELETE /api/estate/:id
 * @method  DELETE
 * @access  Privet (only admin can access this route And the owner of the estate)
 
 */

module.exports.DeleteEstate = asyncHandler (async (req, res) => {
    const estate = await Estate.findByIdAndDelete(req.params.id);
    if (estate) {
        res.status(200).json({message : "success"});
    } else {
        res.status(404).json({message : 'Estate not found'});
    }
});

