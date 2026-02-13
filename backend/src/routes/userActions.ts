import Users from "../models/Users";
import mongoose from "mongoose";
import Addresses from "../models/Addresses";
import express, { Request, response, Response } from "express";
import authCookieVerify from "../controllers/authCookieVerify";
import { userRequest, addressDetails } from "../interfaces";
import randNum from "../controllers/randNum";
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
      // console.log(user);
      return res.status(200).json({ data: user });
      //please fix and make this api good . dont forget this aint done yet no error handlign has been done
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        code:"ERR",
        message:"Some Error on our end please refresh"
      })
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
      let isDef = false;
      if (addCount === 0 || data?.isDefault) {
        isDef = true;
      }
      if (addCount != 0 && data?.isDefault) {
        const addr_id = user.defaultAddress;
        const address = await Addresses.findById(addr_id);
        if (address) {
          address.isDefault = false;
          address?.save();
        }
      }
      const address = new Addresses({
        addressID: randID,
        fullName: data.fullName,
        street: data.street,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
        phone: data.phone,
        user: user._id,
        isDefault: isDef,
      });
      await address.save();

      user.addresses.push(address._id);
      if (addCount === 0 || data?.isDefault) {
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

router.post(
  "/update-user-address",
  authCookieVerify,
  async (req: userRequest, res: Response) => {
    const userData = req.user;
    console.log("Reached API");
    try {
      const data = req.body;
      const address = await Addresses.findOne({ addressID: data.addressID });
      if (!address) {
        return res.status(400).json({
          code: "NO_ADDR",
          message: "Please choose a valid address before updating the address",
        });
      }
      address.fullName = data.fullName;
      address.street = data.street;
      address.city = data.city;
      address.state = data.state;
      address.country = data.country;
      address.postalCode = data.postalCode;
      address.phone = data.phone;

      if (data.isDefault) {
        const user = await Users.findOne({ userID: userData.userID });
        if (!user) {
          return res.status(400).json({
            code: "NO_USR",
            message: "Please login before updating the address",
          });
        }
        const prevDefAddr = user.defaultAddress;
        const prevAddress = await Addresses.findById(prevDefAddr);
        if (!prevAddress) {
          throw new Error("Couldnt get previos address");
        }
        prevAddress.isDefault = false;
        address.isDefault = true;
        await prevAddress.save();
        user.defaultAddress = address._id;
        await user.save();
      }else{
        address.isDefault = false;
      }
      await address.save();

      return res.status(200).json({
        code: "OK",
        message: "Updated the address",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        code: "ERR",
        message: "Some Error on our end please try again later",
      });
    }
  },
);

router.post('/delete-user-address',authCookieVerify,async(req:userRequest,res:Response)=>{
  const userData = req.user;
  try{
    const data = req.body;
    const address = await Addresses.findOne({addressID:data.addressID});
    if(!address){
      throw new Error("NoSuchAddress");
    }
    if(address.isDefault){
      return res.status(403).json({
        code:"NOT_ALLOWED",
        message:"You cannot delete the default address. choose other address as default before doing so"
      })
    }
    const user = await Users.findOne({userID:userData.userID});
    if(!user){
      throw new Error('NoUser');
    }
    user.addresses = user.addresses.filter(id => id.toString() !== address._id.toString());
    await user.save();
    await Addresses.deleteOne({addressID:data.addressID});
    return res.status(200).json({
      code:"OK",
      message:"Address deleted successfully"
    })
  }catch(err){
    console.log(err);
    return res.json(500).json({
      code:"ERR",
      message:"Some error on our end please delete later"
    })
  }
})
export default router;
