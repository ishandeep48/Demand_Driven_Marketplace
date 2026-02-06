import {Express} from 'express'
import productDetails from './productDetails';
import productActions from './productActions'
import mockPayments from './mockPayment'
import userAuth from './userAuth'

export default function Routes(app : Express):void{
    app.use('/',productDetails);
    app.use('/',productActions);
    app.use('/',mockPayments);
    app.use('/',userAuth);

}