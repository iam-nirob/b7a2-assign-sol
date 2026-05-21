import { Request, Response } from "express";
import { authProvides } from "./auth-provides";

const authLogin = async (req: Request, res: Response) => {
  try {
    const result = await authProvides.authLoginDB(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
export const authController = {
  authLogin,
};
