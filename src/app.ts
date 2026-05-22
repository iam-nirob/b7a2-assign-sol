import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRoute } from "./modules/users/user-route";
import { issuesRoute } from "./modules/issues/issues-route";
import { authRouter } from "./modules/auth/auth-route";
import CookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./middleware/global-error-handiling";
const app: Application = express();
app.use(CookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(
  cors({
    origin: "http://localhost:5678",
  }),
);

app.get("/", (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "server is running" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Importing user routes
app.use("/api", userRoute);
// importing issue routes
app.use("/api/issues", issuesRoute);
// importing auth routes
app.use("/api/auth", authRouter);

// Global Error
app.use(errorHandler);

export default app;
