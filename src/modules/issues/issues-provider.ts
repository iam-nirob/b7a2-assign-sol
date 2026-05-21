import { pool } from "../../db/db";
import { Issue, IssueFilter } from "./issues-interface";

const buildReporterMap = async (issues: any[]) => {
  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  if (reporterIds.length === 0) {
    return new Map<number, { id: number; name: string; role: string }>();
  }

  const reportersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1::int[])`,
    [reporterIds],
  );

  return new Map(
    reportersResult.rows.map((reporter) => [reporter.id, reporter]),
  );
};

const formatIssueResponse = (
  issue: any,
  reporterMap: Map<number, { id: number; name: string; role: string }>,
) => ({
  id: issue.id,
  title: issue.title,
  description: issue.description,
  type: issue.type,
  status: issue.status,
  reporter: reporterMap.get(issue.reporter_id) ?? null,
  created_at: issue.created_at,
  updated_at: issue.updated_at,
});

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
      VALUES($1, $2, $3, $4, COALESCE($5, 'open'))
      RETURNING *
      `,
      [reporter_id, title, description, type, status],
    );
    return result.rows[0];
  } catch (errora: any) {
    throw new Error("Error creating issue: " + (errora.message || errora));
  }
};

const getAllIssuesDB = async (filters: IssueFilter = {}) => {
  try {
    const whereClauses: string[] = [];
    const values: Array<string> = [];

    if (filters.type) {
      values.push(filters.type);
      whereClauses.push(`type = $${values.length}`);
    }

    if (filters.status) {
      values.push(filters.status);
      whereClauses.push(`status = $${values.length}`);
    }

    const orderBy = filters.sort === "oldest" ? "ASC" : "DESC";
    const whereSql = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

    const result = await pool.query(
      `SELECT * FROM issues ${whereSql} ORDER BY created_at ${orderBy}`,
      values,
    );
    const reporterMap = await buildReporterMap(result.rows);

    return result.rows.map((issue) => formatIssueResponse(issue, reporterMap));
  } catch (error: any) {
    throw new Error("Error fetching issues: " + (error.message || error));
  }
};

const getSingleIssueDB = async (id: string) => {
  try {
    const result = await pool.query(`SELECT * FROM issues WHERE id = $1`, [id]);
    if (!result.rows.length) {
      return null;
    }

    const reporterMap = await buildReporterMap(result.rows);
    return formatIssueResponse(result.rows[0], reporterMap);
  } catch (error: any) {
    throw new Error("Error fetching issue: " + (error.message || error));
  }
};

const updateIssueDB = async (id: string, payload: Issue) => {
  try {
    const { title, description, type, status } = payload;
    const result = await pool.query(
      `
      UPDATE issues
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          type = COALESCE($3, type),
          status = COALESCE($4, status)
      WHERE id = $5
      RETURNING *
      `,
      [title, description, type, status, id],
    );
    return result.rows[0];
  } catch (error: any) {
    throw new Error("Error updating issue: " + (error.message || error));
  }
};

const deleteIssueDB = async (id: string) => {
  try {
    const result = await pool.query(`DELETE FROM issues WHERE id = $1`, [id]);
    return result;
  } catch (error: any) {
    throw new Error("Error deleting issue: " + (error.message || error));
  }
};

export const issuesProvider = {
  issuesCreateDB,
  getAllIssuesDB,
  getSingleIssueDB,
  updateIssueDB,
  deleteIssueDB,
};
