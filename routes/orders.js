const express = require('express');
const router = express.Router();
const { createOrder,getAllOrders,getOrderById } = require('../controllers/orderController'); // Adjust path as necessary
const { verifyTokenAndCreateUser,verifyTokenAndAdmin,verifyTokenAndAuthorization } = require('../middleware/verify'); // Adjust path as necessary

router
    .route('/create')
    .post(verifyTokenAndCreateUser, createOrder);//went edit
router
    .route('/')
    .get(verifyTokenAndAdmin, getAllOrders);
router
    .route('/:id')
    .get( getOrderById);//went edit


module.exports = router;
