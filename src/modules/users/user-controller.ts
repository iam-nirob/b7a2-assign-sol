import { Request, Response } from "express";
import { userProvider } from "./user-provider";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userProvider.createUserDB(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || error });
  }
};

export const userController = {
  createUser,
};
