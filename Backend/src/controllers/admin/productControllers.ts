import { Request, Response } from "express";
import Product from "../../database/models/productModel";

class ProductController {
  async addProduct(req: Request, res: Response): Promise<void> {
    // Normalize and destructure
    const productName = req.body.productName;
    const productDescription = req.body.productDescription;
    const productPrice = req.body.productPrice;
    const productTotalStockQty = req.body.productTotalStockQty;
    const productImageUrl = req.body.productImageUrl;

    let fileName 
    if(req.file) {
      fileName = req.file?.filename
    }else{
        fileName = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lfGVufDB8fDB8fHww"
    }

    // Missing fields check
    const missingFields: string[] = [];
    if (!productName) missingFields.push("productName");
    if (!productDescription) missingFields.push("productDescription");
    if (!productPrice) missingFields.push("productPrice");
    if (!productTotalStockQty) missingFields.push("productTotalStockQty");
    if (!productImageUrl) missingFields.push("productImageUrl");

    await Product.create({
      productName,
      productDescription,
      productPrice,
      productTotalStockQty,
      productImageUrl : fileName
    })
    res.status(201).json({
      message: "Product added successfully"
    })
  }
}

export default new ProductController();