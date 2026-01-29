import {Express} from 'express'
import productDetails from './productDetails';
import productActions from './productActions'
import mockPayments from './mockPayment'

export default function Routes(app : Express):void{
    app.use('/api',productDetails);
    app.use('/api',productActions);
    app.use('/',mockPayments);

}