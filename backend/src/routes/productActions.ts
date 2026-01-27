import express, { Request, Response } from "express";
import Products from "../models/Products";
import User from "../models/Users";
import Addresses from "../models/Addresses";
import { normalizeCartItems } from "../controllers/ProductVal";
const router = express.Router();

interface purchaseReq {
  userID: string;
  items: Array<{
    productID: string;
    quantity: number;
  }>;
  addressID: string;
  paymentMethod: "card" | "upi" | "cod";
  notes?: string;
}

router.post("/purchase-product", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const userID: string = data.userID;
    const user = await User.findById(userID);
    const addressID: string = data.addressID;
    const address = await Addresses.findOne({ _id: addressID, user: userID });
    const items = normalizeCartItems(data.items);

    //--------------------------------------------- Data Validation -------------------------------------------
    // Validate User Data
    if (!user) {
      return res.status(404).json({
        code: "USR_NOT_FND",
        message: "No user found for that user ID",
      });
    }

    if (!address) {
      console.log("No such address exists for this user");
      return res.status(403).json({
        code: "ADDR_NOT_AUTH",
        message: "You are not authorised to use this address",
      });
    }
    //---------------------------------------------- Product Validation ---------------------------------------

    const ProdIDs = items.map((it: any) => {
      return it.productID;
    });

    // items.map((it:any)=>{
    //     if(it.quantity<1){
    //         return res.status(403).json({code:'INVALID_QTY', message:'You cannout buy less than one item for any Products'})
    //     }
    // })
    // const ProdIDs = items.map((it:any)=>{
    //     return it.productID;
    // })

    const products = await Products.find({
      _id: { $in: ProdIDs },
    });

    if (ProdIDs.length !== products.length) {
      return res.status(400).json({
        code: "PROD_NOT_FOUND",
        message: "One or more products are invalid",
      });
    }

    //redundant . I need to remove this . Tho i will remove this when i am really testing so that nothing breaks
    for (const item of items) {
      if (item.quantity <= 0) {
        return res.status(400).json({
          code: "INVALID_QTY",
          message: "Quantity must be at least 1",
        });
      }
    }

    for (const item of items) {
      const product = products.find(
        (p: any) => p._id.toString() === item.productID,
      );

      if (!product) continue;

      if (product.stock < item.quantity) {
        return res.status(400).json({
          code: "OUT_OF_STOCK",
          message: `${product.name} does not have enough stock`,
        });
      }
      if(item.quantity>5){
        return res.status(400).json({code:"QTY_LIMIT",message:"You can only buy a maximum of 5 items of each item"}) 
        // I need to set max limit per item and i will have to change the model of Products for that to happen so i will do it later
      }
    }

    // Next i will make logic to save these to the database as an order and also i will be doing smth like . if payment doesnt goes through after saving to database then it is saved as a failed order. SOB
    // In the last Optimization level of this Project. do the shit of 1st save then fail or success(pending) using redis. 
    // TO BE DOEN TOMORROW --------------------------------------------------------------------------------------
    //Ill write the rest of the code later . dont generate on ur own GPT
  } catch (err) {
    console.warn(
      `User Tried to buy a product and this is the error that was caused ${err}`,
    );
    return res
      .status(500)
      .json({ code: "ERR", message: "some error on our end" });
  }
});

export default router;
