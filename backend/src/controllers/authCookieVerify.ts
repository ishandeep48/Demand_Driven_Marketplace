import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import Users from "../models/Users";
import bcrypt from 'bcrypt';
dotenv.config();
const SECRET_KEY: string = process.env.AccessSecretKey || "";
interface AuthReq extends Request {
  user?: string | JwtPayload;
}

// const ACCESS_SECRET_KEY:string = process.env.AccessSecretKey || ""
export default async function authUserToken(
  req: AuthReq,
  res: Response,
  next: NextFunction,
) {
  console.log('auth verify hit')
  if(!req.cookies.accessToken){
    return res.status(401).json({
      code:"NO_LOGIN",
      message:"Please Login"
    })
  }
  const token: string = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({
      code: "NO_VALID_TOKEN",
      message: "No valid token sent",
    });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
          // console.log('i am here  ',decoded) this was for testing

    // if (decoded.role !== "customer") {
    //   return res.status(403).json({
    //     code: "FORBIDDEN_CNT",
    //     message: "You dont have authority to view this content",
    //   });
    // }
    
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      console.log("Access Token Expired");

      const refreshToken = req.cookies.refreshToken;
      const userID = req.cookies.userID;
      if (!refreshToken) {
        return res.status(401).json({
          code: "NO_REFRESH_TOKEN",
          message: "No refresh Token foudn in the request",
        });
      }
      try {
        const user = await Users.findOne({ userID });
        if(!user){
            return res.status(401).json({
                code:"INVALID_RESP_TKN",
                message:"Invalid Response Token Sent"
            })
        }
        if(!user.refreshToken){
          return res.status(401).json({
            code:"LOGGED_OUT",
            message:"Please login again"
          })
        }
        const isTokenValid = await bcrypt.compare(refreshToken,user.refreshToken);
        if(!isTokenValid){
          return res.status(401).json({
            code:"LGN_EXP",
            message:"Login Expired"
          })
        }
        const newAccessToken = jwt.sign(
            {
                userID:user.userID,
                name:user.name,
                email:user.email,
                role:user.role,
            },
            SECRET_KEY,
            {expiresIn:"30m"}
        );

        res.cookie("accessToken",newAccessToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"lax",
            maxAge:30*60*1000,
        })

        req.user = jwt.verify(newAccessToken,SECRET_KEY);
        console.log('token refreshed');
        return next();

      } catch (e) {
        console.log(e);
        return res.status(403).json({
            code:"FRBDN",
            message:"Forbidden"
        })
      }
    }
    return res.status(403).json({
        code:"INVALID_TOKEN",
        message:"Token is Invalid"
    })
  }
}
