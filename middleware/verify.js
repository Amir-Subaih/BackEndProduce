const jwt = require('jsonwebtoken');
//const {Estate} = require('../modules/Estate');

function verifyToken(req, res, next) {
    const token = req.headers.token;
    if (token){
        try{
            const decoded = jwt.verify(token, process.env.JWR_SECRET);
            req.user = decoded;
            next();
        }catch(error){
            res.status(401).json({message: 'Invalid token'});
        }
    }else{
        res.status(401).json({message: 'no token provided'});
    }
}

// Verify token & Authorization the user
function verifyTokenAndAuthorization(req, res, next) {
    verifyToken(req, res, () => {
     if(req.user.id === req.params.id 
        || req.user.isAdmin){
         next();
        }else{
            res.status(403).json({message: 'You are not allowed '});
        }
    });
}
// Verify token & Admin
function verifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json({message: 'You are not allowed '});
        }
    });
}

// Verify token & Authorization the user
function verifyTokenAndEstate(req, res, next) {
    verifyToken(req, res, () => {
     if(req.user.id === req.body.ownerId
        || req.user.id === req.body.userId){
         next();
        }else{
            res.status(403).json({message: 'You are not allowed '});
        }
    });
}

// // verify token and admin and owner of the estate
// async function verifyTokenAndAdminAndOwner(req, res, next) {
//     // Retrieve estateId from request parameters
//     const estateId = req.params.id;

//     try{
//         // Find the estate by its ID
//         const estate = await Estate.findById(estateId);
//         verifyToken(req, res, () => {
//             if(req.user.isAdmin || req.user.id === estate.ownerId.toString()){
//                 next();
//             }else{
//                 res.status(403).json({message: 'You are not allowed '});
//             }
//         });
//     }catch(error){
//         res.status(404).json({message: 'Estate not found', error: error});
//     }
    
// }

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization, 
    verifyTokenAndAdmin,
    verifyTokenAndEstate,
    //verifyTokenAndAdminAndOwner
};
