import bodyParser from "body-parser";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import path from "path";
import { HttpError } from "../types";

const AWS = require("aws-sdk");

require("dotenv").config();

const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV;
const apiRouter = express.Router();
const app = express();

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "dist")));

app.use(bodyParser.json());

// Connect to DynamoDB database
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

// All routes go through the API router
app.use("/api", apiRouter);

// order route goes through api route
apiRouter.use("/order", require("./orderRoute"));

apiRouter.get("/", (req: Request, res: Response) => {
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
