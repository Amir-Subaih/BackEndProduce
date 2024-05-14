const express = require('express');
const router = express.Router();
const { verifyTokenAndEstate,verifyTokenAndAdmin,verifyTokenAndAuthorization } = require('../middleware/verify')
const { createFeedback,getAllFeedbacks
        ,getFeedbackByID,getFeedbackByUserID 
        ,DeleteFeedback,updateFeedback } = require('../controllers/feedbackController');

/**
 * @desc    Create a new feedback
 * @route   POST /api/feedback
 * @method  POST
 * @access  Private
 */

router
        .route('/')
        .post(verifyTokenAndEstate ,createFeedback)
        .get(verifyTokenAndAdmin ,getAllFeedbacks);


router
        .route('/all')
        .get(getAllFeedbacks);

router 
        .route('/:id')
        .get(verifyTokenAndAdmin ,getFeedbackByID)
        .put(verifyTokenAndAdmin ,updateFeedback)
        .delete(verifyTokenAndAdmin,DeleteFeedback);

router
        .route('/user/:id')
        .get(verifyTokenAndAuthorization ,getFeedbackByUserID);


module.exports = router;
