import {Express} from 'express'
import productDetails from './productDetails'

export default function Routes(app : Express):void{
    app.use('/api',productDetails);

}