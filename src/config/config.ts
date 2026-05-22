import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  connection_string: process.env.DATABASE_URL as string,
  port: process.env.PORT || 5678,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
  refresh_token: process.env.REFRESH_TOKEN as string,
  access_token_time: process.env.ACCESS_TOKEN_TIME as string,
  refresh_token_time: process.env.REFRESH_TOKEN_TIME as string,
};

export default config;
