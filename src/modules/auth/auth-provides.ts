import bcrypt from "bcryptjs";
import { pool } from "../../db/db";
import { IAuthLoginRequest } from "./auth-interface";
import jwt from "jsonwebtoken";
import config from "../../config/config";

const authLoginDB = async (payload: IAuthLoginRequest) => {
  try {
    console.log(payload);
    const { email, password } = payload;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const userData = await pool.query(
      `
      SELECT * FROM users WHERE email = $1
      `,
      [email],
    );

    console.log(userData);
    if (!userData) {
      throw new Error("Not Registered. Please Sign Up!");
    }

    const user = userData.rows[0];

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const matchPassword = await bcrypt.compare(
      password as string,
      user.password,
    );

    if (!matchPassword) {
      throw new Error("Invalid email or password");
    }

    const jwtPayLoad = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    const token = jwt.sign(jwtPayLoad, config.JWT_SECRET_KEY as string, {
      expiresIn: "1d",
    });
    console.log(token);

    return { token, user: jwtPayLoad };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const authProvides = {
  authLoginDB,
};
