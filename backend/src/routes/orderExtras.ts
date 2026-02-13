import express, { Response } from "express";
import { userRequest } from "../interfaces";
import authCookieVerify from "../controllers/authCookieVerify";
import Users from "../models/Users";
import Orders from "../models/Orders";
const router = express.Router();

router.get(
  "/get-user-addresses",
  authCookieVerify,
  async (req: userRequest, res: Response) => {
    const userData = req.user;
    try {
      const user = await Users.findOne({ userID: userData.userID })
        .populate({
          path: "addresses",
          select: "-_id -user",
        })
        .select("addresses");
      if (!user || user.addresses.length == 0) {
        throw new Error("No User or address Found");
      }
      const addresses = user.addresses;
      return res.status(200).json({
        code: "OK",
        message: addresses,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        code: "ERR",
        message: "Some Error while fetching your stored addresses",
      });
    }
  },
);

router.get(
  "/get-user-orders",
  authCookieVerify,
  async (req: userRequest, res: Response) => {
    const userData = req.user;
    try {
      const user = await Users.findOne({ userID: userData.userID });
      if (!user) {
        throw new Error("No Users");
      }
      const orders = await Orders.find({ user: user._id })
        .populate({ path: "items.product",
            select:'_id orderID name category'
         })
        .select("-user -paymentStatus -createdAt -updatedAt");
      console.log(orders);
         return res.status(200).json({
            code:"OK",
            message:"Successfully retrieved orders",
            data:orders
         })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            code:"ERR",
            message:"Some Error Occured"
        })
    }
  },
);

export default router;
