import { Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import { KhaltiResponse, OrderData, PaymentMethod } from "../../types/orderTypes";
import Order from "../../database/models/orderModel";
import Payment from "../../database/models/paymentModel";
import OrderDetail from "../../database/models/orderDetailsModel";
import axios from "axios";

class OrderController {
  async createOrder(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const {
      phoneNumber,
      shippingAddress,
      totalAmount,
      paymentDetails,
      items,
    }: OrderData = req.body;

    // Missing fields check
    const missingFields: string[] = [];
    if (!userId) missingFields.push("userId");
    if (!phoneNumber) missingFields.push("phoneNumber");
    if (!shippingAddress) missingFields.push("shippingAddress");
    if (!totalAmount) missingFields.push("totalAmount");
    if (!paymentDetails.paymentMethod) missingFields.push("paymentDetails");
    if (items.length == 0) missingFields.push("items");

    if (missingFields.length > 0) {
      res.status(400).json({
        message: `Missing required field(s): ${missingFields.join(", ")}`,
      });
      return;
    }

    const Data = await Payment.create({
      paymentMethod: paymentDetails.paymentMethod,
    });

    const orderData = await Order.create({
      userId,
      phoneNumber,
      shippingAddress,
      totalAmount,
      paymentId: Data.id,
    });

    let responseOrderData ; 

    for (let i = 0; i < items.length; i++) {
      await OrderDetail.create({
        quantity: items[i]?.quantity,
        productId: items[i]?.productId,
        orderId: orderData.id,
      });
    }

    if (paymentDetails.paymentMethod === PaymentMethod.Khalti) {
      // Khalti integration
      const paymentData = {
          return_url: "http://localhost:5050/success", // frontend url
          purchase_order_id: orderData.id,
          amount: totalAmount * 100,  // amount in paisa
          website_url: process.env.BASE_URL, // frontend url
          purchase_order_name : 'orderName_' + orderData.id,
      }
      const response = await axios.post('https://dev.khalti.com/api/v2/epayment/initiate/', paymentData, {
          headers: {
              'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`
          }
      })
      const KhaltiResponse : KhaltiResponse = response.data
      Data.pidx = KhaltiResponse.pidx
      Data.save()
      res.status(200).json({
        message: "Order placed successfully",
        rel: KhaltiResponse.payment_url,
        data: responseOrderData,
      })
    } else {
      res.status(200).json({
        message: "Order placed successfully",
        data: orderData,
      });
    }
  }
}

const orderController = new OrderController();
export default orderController;