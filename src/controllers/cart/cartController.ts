import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import Cart from "../../database/models/caetModel";
import Product from "../../database/models/productModel";
import Category from "../../database/models/categoryModel";

class CartController {
    async addToCart(req:AuthRequest,res:Response):Promise<void>{
        const userId = req.user?.id
        const quantity = req.body.quantity
        const productId = req.body.productId

        // Missing fields check
        const missingFields: string[] = [];
        if (!quantity) missingFields.push("quantity");
        if (!productId) missingFields.push("productId");

        if (missingFields.length > 0) {
            res.status(400).json({
              message: `Missing required field(s): ${missingFields.join(", ")}`,
            });
            return;
          }
        // check if the product alreay exists in the cart table or not 
        const cartItem = await Cart.findOne({where:{userId,productId}})
        if(cartItem){
            cartItem.quantity += quantity
            await cartItem.save()
        }else{
            await Cart.create({userId,quantity,productId})
        }

        const data = await Cart.findAll({where:{userId}})
        res.status(200).json({
            message:"Product added to cart successfully",
            data
        })
    }
    async getMyCarts(req:AuthRequest,res:Response):Promise<void>{
        const userId = req.user?.id
        const cartItems = await Cart.findAll({where:{userId},
            include : [
                {
                    model:Product,
                    attributes : ["id","productName","productImage","productPrice"],
                    include : [
                        {
                            model : Category,
                            attributes : ["id","categoryName"]
                        }
                    ]
                }
            ]
        })


        if(!cartItems){
            res.status(404).json({
                message:"Cart not found"
            })
            return
        }
        res.status(200).json({
            message:"Cart found successfully",
            data:cartItems
        })
    }
    async deleteMyCartItem(req:AuthRequest,res:Response):Promise<void>{
        const userId = req.user?.id
        const {productId} = req.params
        const cartItem = await Cart.findOne({where:{userId,productId}})
        if(!cartItem){
            res.status(404).json({
                message:"Cart item not found"
            })
            return
        }
        await cartItem.destroy()
        res.status(200).json({
            message:"Cart item deleted successfully"
        })
    }
    async updateCartItem(req:AuthRequest,res:Response):Promise<void>{
        const userId = req.user?.id
        const {productId} = req.params
        const {quantity} = req.body
        const cartItem = await Cart.findOne({where:{userId,productId}})
        if(!cartItem){
            res.status(404).json({
                message:"Cart item not found"
            })
            return
        }
        cartItem.quantity = quantity
        await cartItem.save()
        res.status(200).json({
            message:"Cart item updated successfully",
            data : cartItem
        })
    }
}

const cartController = new CartController();
export default cartController