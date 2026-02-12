import express, { Request, Response } from "express";
import authCookieVerify from "../controllers/authCookieVerify";
import Order from "../models/Orders";
import Users from "../models/Users";
import { userRequest } from "../interfaces";
const router = express.Router();

router.get(
  "/total-amount/:orderID",
  authCookieVerify,
  async (req: userRequest, res: Response) => {
    try {
      const orderId = req.params.orderID;
      const user = await Users.findOne({ userID: req.user.userID });
      const order = await Order.findById(orderId);
      if (!order || !user) {
        return res.status(404).json({
          code: "ORDER_NOT_FND",
          message: "No order for this order id",
        });
      }
      if (order.user.toString() != user._id.toString()) {
        return res.status(403).json({
          code: "USER_MISMATCH",
          message: "Please login from the same ID you made teh order",
        });
      }
      if (order.orderStatus != "pending") {
        return res.status(403).json({
          code: "ORDR_ALR_DONE",
          message: "Orders payment's window closed please create a new Order",
        });
      }
      const items = order.items;

      const totalAmount = items.reduce((sum, it) => {
        return sum + it.quantity * it.price;
      }, 0);

      return res.status(200).json({
        code: "OK",
        message: totalAmount,
        // data: totalAmount,
      });
    } catch (err) {
      console.warn(`errror whiel calculating total amount ${err}`);
      return res
        .status(500)
        .json({ code: "ERR", message: "some error on our end" });
    }
  },
);

router.post(
  "/mock-payment/success",
  authCookieVerify,
  async (req: userRequest, res: Response) => {
    try {
      const orderId = req.body.orderId;
      const user = await Users.findOne({ userID: req.user.userID });
      const order = await Order.findById(orderId);
      if (!order || !user) {
        return res.status(404).json({
          code: "ORDER_NOT_FND",
          message: "Not for found for that ID",
        });
      }
      if (order.user.toString() != user._id.toString()) {
        return res.status(403).json({
          code: "USER_MISMATCH",
          message: "Please login from the same ID you made teh order",
        });
      }
      if (order.orderStatus != "pending") {
        return res.status(403).json({
          code: "ORDR_ALR_DONE",
          message: "Orders payment's window closed please create a new Order",
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
  },
);

router.post(
  "/mock-payment/abort",
  authCookieVerify,
  async (req: userRequest, res: Response) => {
    try {
      console.log(req.body);
      const orderId = req.body.orderId;
      const order = await Order.findById(orderId);
      const user = await Users.findOne({ userID: req.user.userID });
      if (!order || !user) {
        return res.status(404).json({
          code: "NOT_FND",
          message: "Order with that order ID not found",
        });
      }
      if (order.user.toString() != user._id.toString()) {
        return res.status(403).json({
          code: "USER_MISMATCH",
          message: "Please login from the same ID you made teh order",
        });
      }
      if (order.orderStatus != "pending") {
        return res.status(403).json({
          code: "ORDR_ALR_DONE",
          message: "Orders payment's window closed please create a new Order",
        });
      }
      order.paymentStatus = "failed";
      order.orderStatus = "cancelled";
      order.save();

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
  },
);

router.post(
  "/mock-payment/simulateFail",
  authCookieVerify,
  async (req: userRequest, res: Response) => {
    try {
      const orderId = req.body.orderId;
      const order = await Order.findById(orderId);
      const user = await Users.findOne({ userID: req.user.userID });
      if (!order || !user) {
        return res.status(404).json({
          code: "NOT_FND",
          message: "Order with that order ID not found",
        });
      }
      if (order.user.toString() != user._id.toString()) {
        return res.status(403).json({
          code: "USER_MISMATCH",
          message: "Please login from the same ID you made teh order",
        });
      }
      if (order.orderStatus != "pending") {
        return res.status(403).json({
          code: "ORDR_ALR_DONE",
          message: "Orders payment's window closed please create a new Order",
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

export default router;
