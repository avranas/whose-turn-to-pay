import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import path from "path";
require("dotenv").config();

const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV;
const router = express.Router();
const app = express();

interface HttpError {
  status: number;
  message: string;
}

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "dist")));

// All routes go through the API router
app.use("/api", router);

router.get("/", (req: Request, res: Response) => {
  return res.send("Hello World!");
});

// eslint-disable-next-line
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (nodeEnv === "development") {
    console.log(err);
  }
  res.status(err.status || 500).send(err.message);
});

// Serves React app on all other routes. This must be the last route defined
if (nodeEnv === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
}

app.listen(port, () => {
  console.log(`Starting Whose Turn to Pay server. Listening on port ${port}`);
});
