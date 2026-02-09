import express,{Request,Response} from 'express';
const router= express.Router()

router.get('/test-get',(req:Request,res:Response)=>{
    console.log('get hit')
})
router.post('/test-post',(req:Request,res:Response)=>{
    const data = req.body;
    console.log(data);
})
export default router ;
