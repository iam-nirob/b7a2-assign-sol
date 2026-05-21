import app from "./app";
import config from "./config/config";
import { initDB } from "./db/db";

const main = async () => {
  await initDB();
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
};

await main();
