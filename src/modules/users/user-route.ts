import { Router } from "express";
import { userController } from "./user-controller";

const router = Router();
router.post("/signup", userController.createUser);
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getSingleUser);
router.patch("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);
export const userRoute: any = router;
