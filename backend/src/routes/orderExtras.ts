import express,{Response} from 'express';
import { userRequest } from '../interfaces';
import authCookieVerify from '../controllers/authCookieVerify';
import Users from '../models/Users';
const router = express.Router();

router.get('/get-user-addresses',authCookieVerify,async(req:userRequest,res:Response)=>{
    const userData = req.user;
    try{
        const user = await Users.findOne({userID:userData.userID}).populate({
          path: "addresses",
          select: "-_id -user",
        }).select('addresses')
        if(!user || user.addresses.length == 0){
            throw new Error('No User or address Found');
        }
        const addresses = user.addresses;
        return res.status(200).json({
            code:"OK",
            message:addresses
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            code:'ERR',
            message:"Some Error while fetching your stored addresses"
        })
    }
})


export default router;