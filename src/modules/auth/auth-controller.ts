import { Request, Response } from "express";
import { authProvides } from "./auth-provides";

const authLogin = async (req: Request, res: Response) => {
  try {
    const result = await authProvides.authLoginDB(req.body);
    const { refresh_token } = result;
    res.cookie("refresh_token", refresh_token, {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const result = await authProvides.generateRefreshToken(
      req.cookies.refresh_token,
    );
    res.status(200).json({
      success: true,
      message: "Token Generated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
export const authController = {
  authLogin,
  refreshToken,
};
