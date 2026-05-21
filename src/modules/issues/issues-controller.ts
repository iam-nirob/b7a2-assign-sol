import { Request, Response } from "express";
import { issuesProvider } from "./issues-provider";

const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issuesProvider.issuesCreateDB(req.body);
    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error creating issue: " + (error.message || error),
    });
  }
};

export const issuesController = {
  createIssue,
};
