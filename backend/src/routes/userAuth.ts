// Ill make APIs here to create new account ,  login , update profile , forget password tomorrow. Huehuehue
import express, { Request, Response } from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import Users from "../models/Users";
import jwt from "jsonwebtoken";
import hashPassword from "../controllers/hashPassword";
import randNum from "../controllers/randNum";
import dotenv from 'dotenv'
import crypto from 'crypto'
dotenv.config();
const SECRET_KEY:string = process.env.AccessSecret_Key || "";
interface userDataRegister {
  name: string;
  email: string;
  password: string;
  role: string;
}

router.post("/register-user", async (req: Request, res: Response) => {
  try {
    const data: userDataRegister = req.body;
    const hashedPassword = await hashPassword(data.password);
    const userID:string = randNum();
    const user = new Users({
        userID,
        name:data.name,
        email:data.email,
        password:hashedPassword,
        role:"customer",
    });
    
    
    const accessToken = jwt.sign(
        {
            userID,
            name:data.name,
            email:data.email,
            role:"customer",
        },
        SECRET_KEY,
        {expiresIn:"30m"}
    );
    const refreshToken = crypto.randomBytes(40).toString("hex");
    // const hashedRefresh = await bcrypt.hash(refreshToken,10); // Why did i waste this much time for This shit
    user.refreshToken = refreshToken;
    await user.save();


    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"lax",
        maxAge: 30*60*1000,
    });

    res.cookie("refreshToken",refreshToken,{
      httpOnly:true,
      secure:process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3*30*24*60*60*1000,
    })

    return res.status(201).json({
      code:"OK",
      message:"Registered a New User"
    })

  } catch (err) {
    console.warn("While registering new user", err);
    return res.status(500).json({
      code:"ERR",
      message:"Couldnt register you . Please try again"
    })
  }
});


// Next Ill make the User Login API and then after that i will implement user previous orders , addresses ,  profile page
export default router;
