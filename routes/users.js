const express = require("express");
const router = express.Router();
const { verifyTokenAndAuthorization , verifyTokenAndAdmin } = require("../middleware/verify");
const { updateUser, deleteUser, getAllUsers,getUserById,rateUser } = require("../controllers/userController");

// Get all users
router.route("/")
      .get(verifyTokenAndAdmin,getAllUsers);

// Get user by id && Update user by id && Delete user by id
router.route("/:id")
      .get(verifyTokenAndAuthorization,getUserById)
      .put(verifyTokenAndAuthorization,updateUser)
      .delete(verifyTokenAndAuthorization,deleteUser);

// Route to rate a user
router.post('/:userId/rate', rateUser);

module.exports = router;
