import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRoute } from "./modules/users/user-route";
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

export default app;
