//Later when I try to fix the multi device fix till then this is not a bug its a feature

import cron from "node-cron";
import Users from "../models/Users";

cron.schedule("0 0 * * *", async () => {
  console.log("Deleting older refresh Tokens");
  const expiredTokens = await Users.updateMany(
    {
      refreshTokenAt: {
        $lt: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000),
      },
    },
    {
      $unset : {refreshToken:1}
    },
  );
  console.log(`Deleted a total of ${expiredTokens.modifiedCount} tokens`);
});
