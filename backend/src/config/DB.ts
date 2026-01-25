import {Express} from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();
const databaseURL: any = process.env.dbURL;
export default async function connectDB():Promise<void>{
    // mongoose.connect(databaseURL)
    // .then(()=>{
    //     console.log('Connection to Database Successful');
    // })
    // .catch((e)=>{
    //     console.error(`Got this error ${e}`)
    // })
    if(!databaseURL){
        throw new Error("No Database connection stering passed");
    }
    try{
        await mongoose.connect(databaseURL);
        console.log("database connected");

    }catch(e){
        console.error(e);
    }
}