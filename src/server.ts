import app from "./app";
import config from "./config/config";
import { intBD } from "./db/db";

const main = async () => {
  await intBD();
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
};

await main();
