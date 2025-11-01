import e, { Request, Response } from "express";
import Product from "../../database/models/productModel";
import { AuthRequest } from "../../middleware/auth";
import User from "../../database/models/userModel";
import Category from "../../database/models/categoryModel";
import fs from "fs"

class ProductController {
  // add product
  async addProduct(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    // Normalize and destructure
    const productName = req.body.productName;
    const productDescription = req.body.productDescription;
    const productPrice = req.body.productPrice;
    const productTotalStockQty = req.body.productTotalStockQty;
    const productImage = req.body.productImage;
    const categoryId = req.body.categoryId;

    let fileName;
    if (req.file) {
      fileName = req.file?.filename;
    } else {
      fileName =
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lfGVufDB8fDB8fHww";
    }

    // Missing fields check
    const missingFields: string[] = [];
    if (!productName) missingFields.push("productName");
    if (!productDescription) missingFields.push("productDescription");
    if (!productPrice) missingFields.push("productPrice");
    if (!productTotalStockQty) missingFields.push("productTotalStockQty");
    if (!categoryId) missingFields.push("categoryId");

    if (missingFields.length > 0) {
      res.status(400).json({
        message: `Missing required field(s): ${missingFields.join(", ")}`,
      });
      return;
    }

    await Product.create({
      productName,
      productDescription,
      productPrice,
      productTotalStockQty,
      productImage: fileName,
      userId: userId,
      categoryId: categoryId,
    });
    res.status(201).json({
      message: "Product added successfully",
    });
  }
  // get all products
  async getAllProducts(req: Request, res: Response): Promise<void> {
    const products = await Product.findAll({
      include: [
        {
          model: User,
          attributes: ["id","username", "email"],
        },
        {
          model: Category,
          attributes: ["id","categoryName"],
        },
      ],
    }); // include can be used to get data from another table
    res.status(200).json({
      message: "Products found successfully",
      data: products,
    });
  }
  // get single product
  async getSingleProduct(req: Request, res: Response): Promise<void> {
    const productId = req.params.id;
    const product = await Product.findByPk(productId,
      {
        include: [
          {
            model: User,
            attributes: ["id","username", "email"],
          },
          {
            model: Category,
            attributes: ["id","categoryName"],
          },
        ],
      }
    );
    if (!product) {
      res.status(404).json({
        message: "Product not found",
      });
      return;
    }
    res.status(200).json({
      message: "Product found successfully",
      data: product,
    });
  }
  // edit product
  async editProduct(req: AuthRequest, res: Response): Promise<void> {
    const productName = req.body.productName;
    const productDescription = req.body.productDescription;
    const productPrice = req.body.productPrice;
    const productTotalStockQty = req.body.productTotalStockQty;
    const productImage = req.body.productImage;
    const categoryId = req.body.categoryId;
    const productId = req.params.id;
    // Missing fields check
    const missingFields: string[] = [];
    if (!productName) missingFields.push("productName");
    if (!productDescription) missingFields.push("productDescription");
    if (!productPrice) missingFields.push("productPrice");
    if (!productTotalStockQty) missingFields.push("productTotalStockQty");
    if (!categoryId) missingFields.push("categoryId");

    if (missingFields.length > 0) {
      res.status(400).json({
        message: `Missing required field(s): ${missingFields.join(", ")}`,
      });
      return;
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({
        message: "Product not found",
      });
      return;
    }
    const existingProductImage = product.productImage;
    fs.unlink("./src/uploads/" + existingProductImage, (err) => {
      if (err) {
        console.log("Error deleting file:", err);
      }else{
        console.log("File deleted successfully");
      }
    })
    await product.update({
      productName,
      productDescription,
      productPrice,
      productTotalStockQty,
      productImage: existingProductImage,
      categoryId,
    });
    res.status(200).json({
      message: "Product updated successfully",
    });
  }
  // delete product
  async deleteProduct(req: AuthRequest, res: Response): Promise<void> {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({
        message: "Product not found",
      });
      return;
    }
    const productImage = product.productImage;
    fs.unlink("./src/uploads/" + productImage, (err) => {
      if (err) {
        console.log("Error deleting file:", err);
      }else{
        console.log("File deleted successfully");
      }
    });
    await product.destroy();
    res.status(200).json({
      message: "Product deleted successfully",
    });
  }
}

const productController = new ProductController();
export default productController;
