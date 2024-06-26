const express = require('express');
const router = express.Router();
const { createOrder,getAllOrders,getOrderById,updateOrder,
        deleteOrder,deleteOrderByAdmin } = require('../controllers/orderController'); // Adjust path as necessary
const { verifyTokenAndCreateUser,verifyTokenAndAdmin,verifyTokenAndAuthorization } = require('../middleware/verify'); // Adjust path as necessary

router
    .route('/create')
    .post(verifyTokenAndCreateUser, createOrder);//went edit
router
    .route('/')
    .get(verifyTokenAndAdmin, getAllOrders);
router
    .route('/:id')
    .put(verifyTokenAndAuthorization, updateOrder)
    .delete(verifyTokenAndAuthorization, deleteOrder)
    .get(getOrderById);//went edit

router 
    .route('/admin/:id')
    .get(verifyTokenAndAdmin, deleteOrderByAdmin);


module.exports = router;
