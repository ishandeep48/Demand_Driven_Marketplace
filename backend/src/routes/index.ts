import {Express} from 'express'
import productDetails from './productDetails';
import productActions from './productActions'

export default function Routes(app : Express):void{
    app.use('/api',productDetails);
    app.use('/api',productActions);

}