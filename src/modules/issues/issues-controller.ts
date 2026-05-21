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
    const { sort = "newest", type, status } = req.query;

    const allowedSort = ["newest", "oldest"] as const;
    const allowedType = ["bug", "feature_request"] as const;
    const allowedStatus = ["open", "in_progress", "resolved"] as const;

    if (typeof sort === "string" && !allowedSort.includes(sort as any)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sort value. Use newest or oldest.",
      });
    }

    if (
      type &&
      (typeof type !== "string" || !allowedType.includes(type as any))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid type value. Use bug or feature_request.",
      });
    }

    if (
      status &&
      (typeof status !== "string" || !allowedStatus.includes(status as any))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value. Use open, in_progress, or resolved.",
      });
    }

    const filters: {
      sort: "newest" | "oldest";
      type?: "bug" | "feature_request";
      status?: "open" | "in_progress" | "resolved";
    } = {
      sort: sort as "newest" | "oldest",
    };

    if (typeof type === "string") {
      filters.type = type as "bug" | "feature_request";
    }

    if (typeof status === "string") {
      filters.status = status as "open" | "in_progress" | "resolved";
    }

    const result = await issuesProvider.getAllIssuesDB(filters);
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

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await issuesProvider.getSingleIssueDB(id as string);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Issue fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching issue: " + (error.message || error),
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await issuesProvider.updateIssueDB(id as string, req.body);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error updating issue: " + (error.message || error),
    });
  }
};

export const issuesController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
};
