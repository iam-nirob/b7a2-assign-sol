import { pool } from "../../db/db";
import { Issue } from "./issues-interface";

const issuesCreateDB = async (payload: Issue) => {
  try {
    const { reporter_id, title, description, type, status } = payload;
    if (!reporter_id) {
      throw new Error("Reporter ID is required");
    }
    const user = await pool.query(`SELECT id FROM users WHERE id = $1`, [
      reporter_id,
    ]);
    if (!user.rows.length) {
      throw new Error("Reporter not found");
    }

    if (description.trim().length < 20 || title.trim().length > 150) {
      throw new Error(
        "Description must be at least 20 characters and title must be less than 150 characters",
      );
    }

    const result = await pool.query(
      `
      INSERT INTO issues(reporter_id, title, description, type, status)
      VALUES($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [reporter_id, title, description, type, status],
    );
    return result.rows[0];
  } catch (errora: any) {
    throw new Error("Error creating issue: " + (errora.message || errora));
  }
};

export const issuesProvider = {
  issuesCreateDB,
};
