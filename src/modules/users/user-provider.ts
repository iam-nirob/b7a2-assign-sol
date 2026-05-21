import { pool } from "../../db/db";
import { IUser } from "./user-interface";
import bcrypt from "bcryptjs";
const createUserDB = async (payload: IUser) => {
  try {
    const { name, email, password, role } = payload;
    const hashPassword = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `
      INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, COALESCE($4, 'contributor')) RETURNING *
      `,
      [name, email, hashPassword, role],
    );
    delete result.rows[0].password;
    return result.rows[0];
  } catch (error: any) {
    throw new Error(
      "Error creating user in the database: " + (error.message || error),
    );
  }
};
export const userProvider = {
  createUserDB,
};
