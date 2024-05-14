const express = require('express');
const router = express.Router();
const {registerUser, loginUser} = require('../controllers/authController');


//function to validate Register
router.route('/register').post(registerUser);

//function to validate Login
router.route('/login').post(loginUser);


// export router
module.exports = router;