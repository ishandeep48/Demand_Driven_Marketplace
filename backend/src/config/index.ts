import express,{Express} from 'express';
import cors from 'cors';

export default function middlewares(app:Express):void{
    app.use(express.json())
    console.log('Loaded MiddleWares')
    app.use(cors({
        origin:'*',
        // credentials : true   uncomment while i do next phases
    }))
}