import { Router } from "express";
import { issuesController } from "./issues-controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types/role";

const router = Router();
router.post("/", auth(USER_ROLE.maintainer), issuesController.createIssue);
router.get(
  "/",
  auth(USER_ROLE.maintainer, USER_ROLE.contributor),
  issuesController.getAllIssues,
);
router.get("/:id", auth(USER_ROLE.maintainer), issuesController.getSingleIssue);
router.patch("/:id", auth(USER_ROLE.maintainer), issuesController.updateIssue);
router.delete("/:id", auth(USER_ROLE.maintainer), issuesController.deleteIssue);

export const issuesRoute: any = router;
