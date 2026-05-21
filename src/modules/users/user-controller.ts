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

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userProvider.getAllUsersDB();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: "Users not found" + (error.message || error),
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userProvider.getSingleUserDB(id as string);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: "User not found" + (error.message || error),
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userProvider.updateUserDB(id as string, req.body);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error updating user" + (error.message || error),
    });
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
};
