import express, { Request, Response } from "express";
import Order from "../models/Orders";

const router = express.Router();

router.get("/total-amount/:orderID", async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderID;
    const product = await Order.findById(orderId);
    if (!product) {
      return res.status(404).json({
        code: "ORDER_NOT_FND",
        message: "No order for this order id",
      });
    }
    const items = product.items;

    const totalAmount = items.reduce((sum, it) => {
      return sum + it.quantity * it.price;
    }, 0);

    return res.json(200).json({
      code: "OK",
      message: "totalAmount",
      data: totalAmount,
    });
  } catch (err) {
    console.warn(`errror whiel calculating total amount ${err}`);
    return res
      .status(500)
      .json({ code: "ERR", message: "some error on our end" });
  }
});

router.post("/mock-payment/success", async (req: Request, res: Response) => {
  try {
    const orderId = req.body.orderId;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        code: "ORDER_NOT_FND",
        message: "Not for found for that ID",
      });
    }
    order.paymentStatus = "success";
    order.orderStatus = "paid";

    await order.save();

    return res.status(200).json({
      code: "PAYMENT_SUCCESS",
      message: "Payment Done",
      data: order._id,
    });
  } catch (err) {
    console.warn(`error while setting payment to success ${err}`);
    return res
      .status(500)
      .json({ code: "ERR", message: "some error on our end" });
  }
});

router.post("/mock-payment/abort", async (req: Request, res: Response) => {
  try {
    const orderId = req.body.orderId;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        code: "NOT_FND",
        message: "Order with that order ID not found",
      });
    }
    ((order.paymentStatus = "failed"),
      (order.orderStatus = "cancelled"),
      order.save());

    return res.status(200).json({
      code: "PAYMENT_ABORT",
      message: "Payment Aborted and order cancelled by the user",
      data: order._id,
    });
  } catch (err) {
    console.warn(`Error while setting payemnt to abort`);
    return res.status(500).json({
      code: "ERR",
      message: "Some Error on our end",
    });
  }
});

router.post(
  "/mock-payment/simulateFail",
  async (req: Request, res: Response) => {
    try {
      const orderId = req.body.orderId;
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          code: "NOT_FND",
          message: "Order with that order ID not found",
        });
      }
      order.paymentStatus = "failed";
      order.orderStatus = "failed";

      order.save();

      return res.status(200).json({
        code: "PAYMENT_FAILED",
        message: "Payment Failed",
        data: orderId,
      });
    } catch (err) {
      console.warn(`Error while setting payment to fail ${err}`);
      return res.status(500).json({
        code: "ERR",
        message: "Some error on our end",
      });
    }
  },
);
// make fir payment abort and fail too and and a cron-job for failed order status

export default router;
