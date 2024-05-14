const asyncHandler = require('express-async-handler');
const { User,validateResetPassword } = require('../modules/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { reset } = require('nodemon');


/**
 * @desc    Get Forgit Password View
 * @route   GET /api/password/forgot-password
 * @method  GET
 * @access  Public
 */

module.exports.getForgitPassword = asyncHandler(async (req,res) => {
    res.render('forgit-password');
});


/**
 * @desc  Send Forgit Password Link
 * @route POST /api/password/forgot-password
 * @method POST
 * @access Public
 */

module.exports.sendForgitPasswordLink = asyncHandler(async (req,res) => {
    const user = await User.findOne ({ email: req.body.email });
    if(!user) return res.status(400).json('User not found');

    const secret = process.env.JWT_SECRET + user.password;
    const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '15m' });

    const link = `http://${req.headers.host}/password/reset-password/${user._id}/${token}`;


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
        }
    });

    const maolOptions = {
        from : process.env.USER_EMAIL,
        to: req.body.email,
        subject: 'Password Reset Link',
        html : `
                <div>
                    <h4>Click on the link below to Reset Your Password</h4>
                    <p>${link}</p>
                </div>
        `
    }

    transporter.sendMail(maolOptions, (err,info) => {
        if(err) {
                    console.log(err);
                    return res.status(400).send('Error in sending email');
                }else
                {
                    console.log('Email sent: ' + info.response);
                    res.render('link-sent');
                }
    });

});


/**
 * @desc    Get Reset Password View
 * @route   GET password/reset-password/:userid/:token
 * @method  GET
 * @access  Public
 */


module.exports.getResetPasswordView = asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.userid);
    if(!user) return res.status(400).json('User not found');

    const secret = process.env.JWT_SECRET + user.password;

    try {
        jwt.verify(req.params.token, secret);
        res.render('reset-password', { email: user.email });
    } catch (error) {
        console.log(error);
        res.json({message : 'Error'});
    }


});


/**
 * @desc    Reset The Password
 * @route   POST password/reset-password/:id/:token
 * @method  POST
 * @access  Public
 */


module.exports.resetThePassword = asyncHandler(async (req,res) => {
    const { error } = validateResetPassword(req.body);
    if(error) return res.status(400).json(error.details[0].message);

    const user = await User.findById(req.params.userid);
    if(!user) return res.status(404).json('User not found');

    const secret = process.env.JWT_SECRET + user.password;

    try{
        jwt.verify(req.params.token, secret);
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);

        user.password = req.body.password;
        await user.save();
        res.render('success-password');
    }catch{
        console.log(error);
        res.json({message : 'Error'});
    }

});


