const express = require('express');
const router = express.Router();
const { getForgitPassword,sendForgitPasswordLink,getResetPasswordView,resetThePassword } = require('../controllers/passwordController');

// password/forgot-password
router
        .route('/forgot-password')
        .get(getForgitPassword)
        .post(sendForgitPasswordLink);

// password/reset-password/:userid/:token
router
        .route('/reset-password/:userid/:token')
        .get(getResetPasswordView)
        .post(resetThePassword);

module.exports = router;