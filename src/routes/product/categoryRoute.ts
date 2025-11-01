import express, { Router } from "express";
import auth, { Role } from "../../middleware/auth";
import catchAsync from "../../utils/catchAsync";
import categoryController from "../../controllers/product/categoryController";
const router: Router = express.Router();

router.route("/category")
  .post(
    auth.isAuthenticated,
    auth.restrictTo(Role.Admin),
    catchAsync(categoryController.addCategory)
  )
  .get(catchAsync(categoryController.getAllCategories));

router.route("/category/:id")
  .delete(
    auth.isAuthenticated,
    auth.restrictTo(Role.Admin),
    catchAsync(categoryController.deleteCategory)
  )
  .put(
    auth.isAuthenticated,
    auth.restrictTo(Role.Admin),
    catchAsync(categoryController.editCategory)
  );

export default router;
