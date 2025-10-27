import express, { Router } from "express";
import catchAsync from "../../utils/catchAsync";
import auth, { Role } from "../../middleware/auth";
import { multer, storage } from "../../middleware/multer";
import productControllers from "../../controllers/admin/productControllers";
const upload = multer({ storage });
const router: Router = express.Router();

router.route("/product")
  .post(
    auth.isAuthenticated,
    auth.restrictTo(Role.Admin),
    upload.single("productImage"),
    catchAsync(productControllers.addProduct)
  );

export default router;
