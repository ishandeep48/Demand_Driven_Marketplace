import Users from '../models/Users';
import express,{Request,Response} from 'express';
import authCookieVerify from '../controllers/authCookieVerify'
const router = express.Router()

interface userRequest extends Request{
    user?:any;
}

router.get('/get-user-data',authCookieVerify,async(req:userRequest,res:Response)=>{
    // console.log(req.user)
    // res.send("ok")
    const userData = req.user;
    try{
        const user = await Users.findOne({userID:userData.userID}).populate('addresses defaultAddress').select('-_id name email addresses defaultAddress');
        console.log(user)
        return res.status(200).json({data:user});
        //please fix and make this api good . dont forget this aint done yet no error handlign has been done
    }catch(err){
        console.log(err);
    }
})

export default router;