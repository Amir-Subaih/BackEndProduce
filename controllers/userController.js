const {User , validateUpdatUser} = require('../modules/User');
const asyncHandler = require('express-async-handler');
const bycrypt = require('bcryptjs');
//const {Estate} = require('../modules/Estate');


/**
 * @description Get all users
 * @route GET /api/users
 * @method GET
 * @access Private only(Admin)
 */
const getAllUsers = asyncHandler(
    async (req,res) => {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    }
);

/**
 * @description Get user by id
 * @route GET /api/users/:id
 * @method GET
 * @access Private only(Admin or himself)
 */

const getUserById = asyncHandler(
    async (req,res) => {
        const user = await User.findById(req.params.id).select('-password');
        if(user){
            res.status(200).json(user);
        }else{
            res.status(404).json({message : 'User not found'});
        }
    }
);

/**
 * @description Update user by id
 * @route PUT /api/users/:id
 * @method PUT
 * @access Private only(Admin or himself)
 */

const updateUser = asyncHandler(
    async (req,res) => {
        const {error} = validateUpdatUser(req.body);
        if(error) return res.status(400).json({message : error.details[0].message});

        if(req.body.password){
            const salt = await bycrypt.genSalt(10);
            req.body.password = await bycrypt.hash(req.body.password, salt);
        }
        const updatU = await User.findByIdAndUpdate(req.params.id,{
            $set : {
                email : req.body.email,
                name : req.body.name,
                phone : req.body.phone,
                location:req.body.location,
                password : req.body.password
            }
        },{new : true}).select('-password');
        res.status(200).json({updatU,message : 'success'});
    }
);

/**
 * @description Delete user by id
 * @route DELETE /api/users/:id
 * @method DELETE
 * @access Private only(Admin)
 */

const deleteUser = asyncHandler(
    async (req,res) => {
        const user = await User.findById(req.params.id);
        const estates = await Estate.find({ownerId:req.params.id}).select('_id');
        if(estates.length > 0){
            for (const estate of estates) {
                await Estate.findByIdAndDelete(estate._id);
            }
            console.log("The author was Delete with his estates");
        }
        if(!user) return res.status(404).json({message : 'User not found'});
        else{
            const deleteU = await User.findByIdAndDelete(req.params.id);
            res.status(200).json({message : 'deleted successfully'});
        }
    }
);

const rateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { value, ratedBy } = req.body;

    // Validate rating value
    if (value < 1 || value > 5) {
        return res.status(400).json({ message: 'Rating value must be between 1 and 5' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has already rated
        const existingRatingIndex = user.ratings.findIndex(rating => rating.ratedBy && rating.ratedBy.toString() === ratedBy);

        let to = 0;
        if (existingRatingIndex !== -1) {
            // Update the existing rating
            to = (user.totalRatings*user.ratings.length) - user.ratings[existingRatingIndex].value;
            to += value;
            user.ratings[existingRatingIndex].value = value;
        } else {
            // Add rating to the user
            to = (user.totalRatings*user.ratings.length) + value;
            user.ratings.push({ value, ratedBy });
        }

        // Update total ratings
        user.totalRatings = to / user.ratings.length;

        // Save user
        await user.save();

        res.status(200).json({ message: 'Rating added successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});




module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    rateUser
}

