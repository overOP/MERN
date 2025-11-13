import { Response, Request } from "express";
import { AuthRequest } from "../../middleware/auth";
import {
  KhaltiResponse,
  OrderData,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  TransactionStatus,
  TransactionVerificationResponse,
} from "../../types/orderTypes";
import Order from "../../database/models/orderModel";
import Payment from "../../database/models/paymentModel";
import OrderDetail from "../../database/models/orderDetailsModel";
import axios from "axios";
import Product from "../../database/models/productModel";
import Category from "../../database/models/categoryModel";
import User from "../../database/models/userModel";

class ExtendedOrder extends Order{
  declare paymentId : string | null
}

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

    let responseOrderData;

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
        amount: totalAmount * 100, // amount in paisa
        website_url: process.env.BASE_URL, // frontend url
        purchase_order_name: "orderName_" + orderData.id,
      };
      const response = await axios.post(
        "https://dev.khalti.com/api/v2/epayment/initiate/",
        paymentData,
        {
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          },
        }
      );
      const KhaltiResponse: KhaltiResponse = response.data;
      Data.pidx = KhaltiResponse.pidx;
      Data.save();
      res.status(200).json({
        message: "Order placed successfully",
        rel: KhaltiResponse.payment_url,
        data: responseOrderData,
      });
    } else {
      res.status(200).json({
        message: "Order placed successfully",
        data: orderData,
      });
    }
  }
  async verifyPayment(req: AuthRequest, res: Response): Promise<void> {
    const { pidx } = req.body;
    if (!pidx) {res.status(404).json({
        message: "Missing required field(s): pidx",
      });
      return;
    }
    const response = await axios.post("https://a.khalti.com/api/v2/epayment/lookup/",{ pidx },{
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
      }
    );
    const data: TransactionVerificationResponse = response.data;
    if (data.status === TransactionStatus.Completed) {
      await Payment.update(
        { paymentStatus: "paid" },
        { where: { pidx: pidx } }
      );
      res.status(200).json({
        message: "Payment verified successfully",
        data: data.status + " " + data.total_amount,
      });
    } else {
      res.status(400).json({
        message: "Payment not verified",
      });
    }
  }
  // customer SIDE Starts here
  async fetchMyOrders(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: Payment,
        },
      ],
    });
    if (!orders) {
      res.status(404).json({
        message: "Orders not found",
        data: [],
      });
      return;
    }
    res.status(200).json({
      message: "Orders found successfully",
      data: orders,
    });
  }
  async fetchOrderDetails(req: AuthRequest, res: Response): Promise<void> {
    const orderId = req.params.id;
    const orderDetails = await OrderDetail.findAll({
      where: { orderId },
      include: [
        {
          model: Product,
          include: [
            {
              model: Category,
              attributes: ["categoryName"],
            },
          ],
        },
        {
          model: Order,
          include: [
            {
              model: Payment,
              attributes: ["paymentMethod", "paymentStatus"],
            },
            {
              model: User,
              attributes: ["username", "email"],
            },
          ],
        },
      ],
    });
    if (orderDetails.length == 0) {
      res.status(404).json({
        message: "Order details not found",
        data: [],
      });
      return;
    }
    res.status(200).json({
      message: "Order details found successfully",
      data: orderDetails,
    });
  }
  async cancelMyOrder(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orderId = req.params.id;

    const order: any = await Order.findAll({ where: { userId, id: orderId } });
    if (
      order?.orderStatus === OrderStatus.Ontheway ||
      order?.orderStatus === OrderStatus.Preparation
    ) {
      res.status(200).json({
        message: "You cannot cancell order when it is in ontheway or prepared",
      });
      return;
    }
    await Order.update(
      { orderStatus: OrderStatus.Cancelled },
      { where: { id: orderId } }
    );
    res.status(200).json({
      message: "Order cancelled successfully",
    });
  }

  // Admin side starts here
  async changeOrderStatus(req: Request, res: Response): Promise<void> {
    const orderId = req.params.id;
    const orderStatus : OrderStatus = req.body.orderStatus;
    
    await Order.update({ orderStatus : orderStatus }, { where : { id : orderId }});
    res.status(200).json({
      message: "Order status changed successfully",
    });
  }
  async changePaymentStatus(req: Request, res: Response): Promise<void> {
    const orderId = req.params.id;
    const paymentStatus : PaymentStatus = req.body.paymentStatus;
    const order = await Order.findByPk(orderId);
    const extendedOrder : ExtendedOrder = order as ExtendedOrder
    await Payment.update({ paymentStatus : paymentStatus }, { where : { id : extendedOrder.paymentId }});
    res.status(200).json({
      message: "Payment status changed successfully",
    });
  }
  async deleteOrder(req: Request, res: Response): Promise<void> {
    const orderId = req.params.id
    const order = await Order.findByPk(orderId);
    const extendedOrder : ExtendedOrder = order as ExtendedOrder

    if(!order){
      res.status(404).json({
        message: "Order not found",
      });
      return
    }
    await OrderDetail.destroy({ where : { orderId : orderId }});
    await Payment.destroy({ where : { id : extendedOrder.paymentId }});
    await Order.destroy({ where : { id : orderId }});
    res.status(200).json({
      message: "Order deleted successfully",
    });
  }
  async fetchOrders(req: AuthRequest, res: Response): Promise<void> {
    const orders = await Order.findAll({ include : [{ model : Payment }]});
    if (!orders) {
      res.status(404).json({
        message: "Orders not found",
        data: [],
      });
      return;
    }
    res.status(200).json({
      message: "Orders found successfully",
      data: orders,
    });
  }
}

const orderController = new OrderController();
export default orderController;