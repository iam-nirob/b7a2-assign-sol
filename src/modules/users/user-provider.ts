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

const getAllUsersDB = async () => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    return result.rows;
  } catch (error: any) {
    throw new Error(
      "Error retrieving users from the database: " + (error.message || error),
    );
  }
};

const getSingleUserDB = async (id: string) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return result.rows[0];
  } catch (error: any) {
    throw new Error(
      "Error retrieving user from the database: " + (error.message || error),
    );
  }
};

const updateUserDB = async (id: string, payload: IUser) => {
  try {
    const { name, email, password, role } = payload;
    const hashPassword = password ? await bcrypt.hash(password, 12) : undefined;
    const result = await pool.query(
      `
      UPDATE users
      SET name = COALESCE($1, name),
          email = COALESCE($2, email),
          password = COALESCE($3, password),
          role = COALESCE($4, role)
      WHERE id = $5
      RETURNING *
      `,
      [name, email, hashPassword, role, id],
    );
    return result.rows[0];
  } catch (error: any) {
    throw new Error(
      "Error updating user in the database: " + (error.message || error),
    );
  }
};

const deleteUserDB = async (id: string) => {
  try {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [id],
    );
    return result.rows[0];
  } catch (error: any) {
    throw new Error(
      "Error deleting user from the database: " + (error.message || error),
    );
  }
};

export const userProvider = {
  createUserDB,
  getAllUsersDB,
  getSingleUserDB,
  updateUserDB,
  deleteUserDB,
};
