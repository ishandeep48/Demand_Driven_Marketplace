import Users from "../models/Users";
import mongoose from "mongoose";
import Addresses from "../models/Addresses";
import express, { Request, Response } from "express";
import authCookieVerify from "../controllers/authCookieVerify";
import { userRequest, addressDetails } from "../interfaces";
import randNum from '../controllers/randNum';
const router = express.Router();

router.get(
  "/get-user-data",
  authCookieVerify,
  async (req: userRequest, res: Response) => {
    // console.log(req.user)
    // res.send("ok")
    const userData = req.user;
    try {
      const user = await Users.findOne({ userID: userData.userID })
        .populate({
          path: "addresses",
          select: "-_id -user",
        })
        .select("-_id name email addresses");
      console.log(user);
      return res.status(200).json({ data: user });
      //please fix and make this api good . dont forget this aint done yet no error handlign has been done
    } catch (err) {
      console.log(err);
    }
  },
);

router.post(
  "/add-user-address",
  authCookieVerify,
  async (req: userRequest, res: Response) => {
    const userData = req.user;
    try {
      const user = await Users.findOne({ userID: userData.userID });
      if (!user) {
        return res.status(400).json({
          code: "USR_NOT_FND",
          message: "User not found",
        });
      }
      const addCount = user?.addresses.length;
      const data: addressDetails = req.body;
      console.log(data);
      if (
        !data.fullName ||
        !data.street ||
        !data.city ||
        !data.state ||
        !data.country ||
        !data.postalCode ||
        !data.phone
      ) {
        return res.status(400).json({
          code: "INCOMPLETE_DATA",
          message: "Send after filling all the fields",
        });
      }

      //   const session = await mongoose.startSession();
      //   try {
      //     await session.withTransaction(async () => {
      const randID = randNum();
      const address = new Addresses({
        addressID:randID,
        fullName: data.fullName,
        street: data.street,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
        phone: data.phone,
        user: user._id,
        isDefault: addCount === 0,
      });
      await address.save();

      user.addresses.push(address._id);
      if (addCount === 0) {
        user.defaultAddress = address._id;
      }
      user.save();
      // });
      res.status(200).send({
        code: "OK",
        message: "Added the to address",
      });
      //   } catch (err) {
      //     console.log(err);
      //     return res.status(500).json({
      //         code:"ERR",
      //         message:"Some error on our end . Please try again later"
      //     });
      //   }finally{
      //     await session.endSession();
      //   }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        code: "ERR",
        message: "Check All the details again",
      });
    }
  },
);

export default router;
