import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config";
import { pool } from "../db/db";
import { ROLE } from "../types/role";

const auth = (...roles: ROLE[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(roles);
    try {
      const token = req?.headers.authorization;
      if (!token) {
        res
          ?.status(401)
          ?.json({ success: false, message: "unathorized access!" });
      }

      const decoded = jwt.verify(
        token as string,
        config.JWT_SECRET_KEY,
      ) as JwtPayload;

      const userData = await pool.query(
        `
      SELECT * FROM users WHERE email=$1
      `,
        [decoded.email],
      );

      const user = userData?.rows[0];
      if (userData.rows.length === 0) {
        res?.status(404)?.json({ success: false, message: "user not found" });
      }

      if (roles.length && !roles?.includes(user.role)) {
        res?.status(403)?.json({ success: false, message: "Role Forbidden" });
      }

      req.user = decoded;

      next();
    } catch (error) {
      throw new Error("Unauthorized token");
    }
  };
};

export default auth;
