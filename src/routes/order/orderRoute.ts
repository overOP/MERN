import express, { Router } from "express";
import auth, { Role } from "../../middleware/auth";
import catchAsync from "../../utils/catchAsync";
import orderController from "../../controllers/order/orderController";
const router: Router = express.Router();

router.route("/order")
  .get(auth.isAuthenticated, catchAsync(orderController.fetchOrders))
  .post(auth.isAuthenticated, catchAsync(orderController.createOrder));
router.route("/order/verify")
  .post(auth.isAuthenticated,auth.restrictTo(Role.Admin), catchAsync(orderController.verifyPayment));

router.route("/customer")
  .get(auth.isAuthenticated, catchAsync(orderController.fetchMyOrders));
router.route("/customer/:id")
  .post(auth.isAuthenticated,auth.restrictTo(Role.Customer), catchAsync(orderController.cancelMyOrder))
  .get(auth.isAuthenticated,auth.restrictTo(Role.Customer), catchAsync(orderController.fetchOrderDetails))

router.route("/admin/payment/:id")
  .patch(auth.isAuthenticated,auth.restrictTo(Role.Admin), catchAsync(orderController.changePaymentStatus))
router.route("/admin/order/:id")
  .patch(auth.isAuthenticated,auth.restrictTo(Role.Admin), catchAsync(orderController.changeOrderStatus))
  .delete(auth.isAuthenticated,auth.restrictTo(Role.Admin), catchAsync(orderController.deleteOrder))  
export default router;
