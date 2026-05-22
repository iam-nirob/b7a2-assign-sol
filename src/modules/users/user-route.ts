import { Router } from "express";
import { userController } from "./user-controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types/role";

const router = Router();

router.post("/signup", userController.createUser);
router.get("/users", auth(USER_ROLE.maintainer), userController.getAllUsers);
router.get(
  "/users/:id",
  auth(USER_ROLE.maintainer),
  userController.getSingleUser,
);
router.patch(
  "/users/:id",
  auth(USER_ROLE.maintainer),
  userController.updateUser,
);
router.delete(
  "/users/:id",
  auth(USER_ROLE.maintainer),
  userController.deleteUser,
);
export const userRoute: any = router;
