import cron from 'node-cron'
import Order from '../models/Orders'

cron.schedule("*/5 * * * *",async()=>{
    console.log("Checking unpaid orders.....");

    const expiredOrders = await Order.updateMany(
        {
            paymentStatus: "pending",
            orderedAt:{ $lte: new Date(Date.now()- 5*60*1000)},
        },
        {
            orderStatus:"failed",
            paymentStatus:"failed",

        }
    );

    console.log("Expired orders cancelled: ", expiredOrders.modifiedCount);
})