import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRoute } from "./modules/users/user-route";
import { issuesRoute } from "./modules/issues/issues-route";
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

app.get("/", (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "server is running" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Importing user routes
app.use("/api/users", userRoute);
// importing issue routes
app.use("/api/issues", issuesRoute);

export default app;
