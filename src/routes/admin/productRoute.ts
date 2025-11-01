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
  )
  .get(catchAsync(productControllers.getAllProducts)
  );

router.route("/product/:id")
  .get(catchAsync(productControllers.getSingleProduct))
  .delete(
    auth.isAuthenticated,
    auth.restrictTo(Role.Admin),
    catchAsync(productControllers.deleteProduct)
  )
  .put(
    auth.isAuthenticated,
    auth.restrictTo(Role.Admin),
    upload.single("productImage"),
    catchAsync(productControllers.editProduct)
  );

export default router;
