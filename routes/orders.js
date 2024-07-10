const express = require('express');
const router = express.Router();
const { createOrder,getAllOrders,getOrderById,updateOrder,
        deleteOrder,deleteOrderByAdmin,getAllOrdersByUserId } = require('../controllers/orderController'); // Adjust path as necessary
const { verifyTokenAndCreateUser,verifyTokenAndAdmin,verifyTokenAndAuthorization,verifyTokenAndAdminAndOwner } = require('../middleware/verify'); // Adjust path as necessary

router
    .route('/create')
    .post(verifyTokenAndCreateUser, createOrder);//went edit
router
    .route('/')
    .get(verifyTokenAndAdmin, getAllOrders);
router
    .route('/:id')
    .put(verifyTokenAndAuthorization, updateOrder)
    .delete(verifyTokenAndAdminAndOwner, deleteOrder)
    .get(getOrderById);//went edit

router
    .route('/user/:id')
    .get(verifyTokenAndAuthorization, getAllOrdersByUserId);
router 
    .route('/admin/:id')
    .delete(verifyTokenAndAdmin, deleteOrderByAdmin);


module.exports = router;
