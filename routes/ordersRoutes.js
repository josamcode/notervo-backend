const express = require("express");
const router = express.Router();
const { verifyToken, optionalVerifyToken, isAdmin } = require("../middlewares/auth");

const {
  createOrder,
  getOrders,
  updateShipping,
  updateOrderStatus,
  deleteOrder,
  applyCoupon,
  removeCouponFromOrders,
  getOrderById,
  getAllOrders,
} = require("../controllers/ordersControllers");

router.get("/", verifyToken, getOrders); // my orders
router.get("/all", verifyToken, isAdmin, getAllOrders); // get all of orders
router.get("/:id", optionalVerifyToken, getOrderById);
router.post("/", optionalVerifyToken, createOrder);
router.put("/shipping/:id", verifyToken, updateShipping);
router.put("/status/:id", verifyToken, isAdmin, updateOrderStatus);
router.delete("/:id", verifyToken, isAdmin, deleteOrder);
router.post("/apply-coupon", verifyToken, applyCoupon);
router.delete("/remove-coupon", verifyToken, removeCouponFromOrders);

module.exports = router;
