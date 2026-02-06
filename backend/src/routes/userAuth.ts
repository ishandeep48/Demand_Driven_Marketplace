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
// import RefreshTokens from "../models/RefreshTokens";
// use zod to validate emails later

dotenv.config();

const SECRET_KEY: string = process.env.AccessSecretKey || "";
interface userDataRegister {
  name: string;
  email: string;
  password: string;
  role: string;
}
interface userDataLogin {
  email: string;
  password: string;
}
router.post("/register-user", async (req: Request, res: Response) => {
  try {
    const data: userDataRegister = req.body;
    const hashedPassword = await hashPassword(data.password);
    // console.log('api called')
    const userID: string = randNum();
    const refreshToken = crypto.randomBytes(40).toString("hex");
    const hashedRefresh = await bcrypt.hash(refreshToken, 3);
    // console.log('api called')
    // console.log(data.name, data.email, data.password, refreshToken, hashedRefresh, hashedPassword)
    const user = new Users({
      userID,
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "customer",
      refreshToken: hashedRefresh,
      refreshTokenAt: new Date()
    });


    const accessToken = jwt.sign(
      {
        userID,
        name: data.name,
        email: data.email,
        role: "customer",
      },
      SECRET_KEY,
      { expiresIn: "30m" }
    );; // Why did i waste this much time for This shit( ooh i understand it now )


    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3 * 30 * 24 * 60 * 60 * 1000,
    })

    return res.status(201).json({
      code: "OK",
      message: "Registered a New User"
    })

  } catch (err) {
    console.warn("While registering new user", err);
    return res.status(500).json({
      code: "ERR",
      message: "Couldnt register you . Please try again"
    })
  }
});

router.post('/login-user', async (req: Request, res: Response) => {
  try {
    const data: userDataLogin = req.body;
    const user = await Users.findOne({ email: data.email }).select('+password');
    if (!user) {
      return res.status(401).json({
        code: "INCR",
        message: "Username or password incorrect"
      })
    }
    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      return res.status(401).json({
        code: "INCR",
        message: "Username or password incorrect"
      })
    }

    const accessToken = jwt.sign(
      {
        userID: user.userID,
        name: user.name,
        email: user.email,
        role: "customer",
      },
      SECRET_KEY,
      { expiresIn: "30m" }
    );
    const refreshToken = crypto.randomBytes(40).toString("hex");
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 3);
    user.refreshToken = hashedRefreshToken;
    user.refreshTokenAt = new Date();
    await user.save()
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3 * 30 * 24 * 60 * 60 * 1000,
    })
    res.json({
      code: "OK",
      message: "login success"
    })

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code: "ERR",
      message: "Some Error on our end"
    })
  }
})
// Next Ill make the User Login API and then after that i will implement user previous orders , addresses ,  profile page
export default router;
