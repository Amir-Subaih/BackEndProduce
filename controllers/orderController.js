const asyncHandler = require('express-async-handler');
const { Order, validateCreateOrder, validateUpdateOrder } = require('../modules/Order'); // Adjust path
const { User } = require('../modules/User'); // Adjust path


/**
 * @description Create Order
 * @route POST /api/order/create
 * @method POST
 * @access Private only(User)
 */

module.exports.createOrder = asyncHandler(async (req, res) => {
    const { error } = validateCreateOrder(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).json({ message: 'User not found' });

    const order = new Order({
        userId: req.body.userId,
        orderArray: req.body.orderArray,
        sumPrice: req.body.sumPrice,
        status: req.body.status
    });

    const result = await order.save();
    res.status(201).json({ result, message: 'Order created successfully' });
});

/**
 * @description Get all orders
 * @route GET /api/order
 * @method GET
 * @access Private only(Admin)
 */

module.exports.getAllOrders = asyncHandler(async (req, res) => {
    const { pageNumber } = req.query;
    const orderPerPage = 4;
    let orders;

    if (pageNumber) {
        orders = await Order.find()
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * orderPerPage)
            .limit(orderPerPage);
    } else {
        orders = await Order.find().sort({ createdAt: -1 });
    }

    res.status(200).json({ orders, message: 'Success' });
});

/**
 * @description Get order by id
 *  @route GET /api/order/:id
 * @method GET
 * @access Private only(Admin)
 */

module.exports.getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ order, message: 'Success' });
});

/**
 * @description Update order by id
 * @route PUT /api/order/:id
 *  @method PUT
 * @access Private only(Admin)
 
 */

module.exports.UpdateOrder = asyncHandler(async (req, res) => {
    const { error } = validateUpdateOrder(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const order = await Order.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, { new: true });

    res.status(200).json({ order, message: 'Order updated successfully' });
});

/**
 * @description Delete order by id
 * @route DELETE /api/order/:id
 * @method DELETE
 * @access Private only(Admin)
 */

module.exports.DeleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json({ message: 'Order deleted successfully' });
});
