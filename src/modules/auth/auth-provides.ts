import bcrypt from "bcryptjs";
import { pool } from "../../db/db";
import { IAuthLoginRequest } from "./auth-interface";
import jwt, { JwtPayload } from "jsonwebtoken";
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

    const refresh_token = jwt.sign(jwtPayLoad, config.refresh_token, {
      expiresIn: "30d",
    });

    return { token, user: jwtPayLoad, refresh_token };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const generateRefreshToken = async (r_token: string) => {
  if (!r_token) {
    throw new Error("unathorized access!");
  }

  const decoded = jwt.verify(
    r_token as string,
    config.refresh_token,
  ) as JwtPayload;

  const userData = await pool.query(
    `
      SELECT * FROM users WHERE email=$1
      `,
    [decoded.email],
  );

  const user = userData?.rows[0];

  if (userData.rows.length === 0) {
    throw new Error("user not found");
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
  return { token };
};

export const authProvides = {
  authLoginDB,
  generateRefreshToken,
};
