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

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issuesProvider.getAllIssuesDB();
    res.status(200).json({
      success: true,
      message: "Issues fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: "Error fetching issues: " + (error.message || error),
    });
  }
};

export const issuesController = {
  createIssue,
  getAllIssues,
};
