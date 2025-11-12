import express, { Router } from "express";
import auth from "../../middleware/auth";
import catchAsync from "../../utils/catchAsync";
import orderController from "../../controllers/order/orderController";
const router: Router = express.Router();

router.route("/order")
  .post(auth.isAuthenticated, catchAsync(orderController.createOrder));

export default router;
