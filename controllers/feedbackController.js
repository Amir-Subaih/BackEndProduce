const asyncHandler = require('express-async-handler');
const { Feedback,validateCreateFeedback,validateUpdateFeedback } = require('../modules/FeedBack');


/**
 * @desc    Create a new feedback
 * @route   POST /api/feedback
 * @method  POST
 * @access  Private
 */

module.exports.createFeedback = asyncHandler (async (req, res) => {
    const {error}  = validateCreateFeedback(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const feedback = new Feedback({
        userId : req.body.userId,
        statement : req.body.statement
    });

    const result = await feedback.save();

    if (!result) {
        res.status(400).json({message: 'failed'});
    }else
    {
        res.status(201).json({result, message: 'success'});
    }
});

/**
 * @desc    Get all feedbacks
 * @route   GET /api/feedback
 * @method  GET
 * @access  Private(admin)
 */

module.exports.getAllFeedbacks = asyncHandler (async (req, res) => {
    let feedbacks ;
    const {pageNum} = req.query;

    if(pageNum){
        const feedbacksPerPage =4;
        feedbacks = await Feedback.find().populate('userId', [
            "_id",
            "name"
        ]).skip((pageNum - 1))
        .limit(feedbacksPerPage)
        .sort({ createdAt: -1 });
    }else{
        feedbacks = await Feedback.find()
        .sort({ createdAt: -1 }).populate('userId', [
            "_id",
            "name"
        ]);

    }

    res.status(200).json({feedbacks, message: 'success'});
});

/**
 * @desc    Get feedback by ID
 * @route   GET /api/feedback/:id
 * @method  GET
 * @access  Private(admin)
 */

module.exports.getFeedbackByID = asyncHandler (async (req, res) => {
    const feedback = await Feedback.findById(req.params.id)
    .sort({ createdAt: -1 });
    if (!feedback) return res.status(404).json({message: 'Feedback not found'});
    res.status(200).json({feedback, message: 'success'});
});

/**
 * @desc    Get All feedbacks by userId
 * @route   GET /api/feedback/user/:id
 * @method  GET
 * @access  Private (user and admin)
 */

module.exports.getFeedbackByUserID = asyncHandler (async (req, res) => {
    const feedbacks = await Feedback.find({userId : req.params.id}).sort('-date');
    if (!feedbacks) return res.status(404).json({message: 'Feedback not found'});
    res.status(200).json({feedbacks, message: 'success'});
});


/**
 * @desc    Update feedback by ID
 * @route   PUT /api/feedback/:id
 * @method  PUT
 * @access  Private(admin)
 */

module.exports.updateFeedback = asyncHandler (async (req, res) => {
    const {error}  = validateUpdateFeedback(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const feedback = await Feedback.findByIdAndUpdate(req.params.id, {
        $set : 
                {
                    statement : req.body.statement
                }
    }, {new: true});

    if (!feedback) return res.status(404).json({message: 'Feedback not found'});
    res.status(200).json({feedback, message: 'success'});
});

/**
 * @desc    Delete Feedback by id
 * @route   DELETE /api/feedback/:id
 * @method  DELETE
 * @access  Privet (only admin can access this route And the owner of the Feedback)
 
 */

module.exports.DeleteFeedback = asyncHandler (async (req, res) => {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (feedback) {
        res.status(200).json({message : "success"});
    } else {
        res.status(404).json({message : 'Feedback not found'});
    }
});
