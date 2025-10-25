import express,{ Router } from 'express'
import AuthController from '../../controllers/auth/userControllers';
import catchAsync from '../../utils/catchAsync';
const router:Router=express.Router();

router.route("/register")
.post(catchAsync(AuthController.registerUser));

router.route("/login")
.post(catchAsync(AuthController.loginUser));

export default router;