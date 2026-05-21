export interface Issue {
  reporter_id: number | string;
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
}

type IssueSortOrder = "newest" | "oldest";
export type IssueFilter = {
  sort?: IssueSortOrder;
  type?: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
};
