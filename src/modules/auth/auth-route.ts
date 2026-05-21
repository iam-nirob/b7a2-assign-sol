import { Router } from "express";
import { authController } from "./auth-controller";

const router = Router();
router.post("/login", authController.authLogin);
export const authRouter: any = router;
