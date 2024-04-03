import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import path from "path";
import { v4 as uuidv4 } from "uuid";
require("dotenv").config();

const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV;
const router = express.Router();
const app = express();
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

interface HttpError {
  status: number;
  message: string;
}

interface OrderItem {
  id: string;
  time_created: number;
  bob_cost: number;
  jeremy_cost: number;
}

interface DynamoDBParams {
  TableName: string;
  Item: OrderItem;
}

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "dist")));

// Connect to DynamoDB database
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

// All routes go through the API router
app.use("/api", router);

router.get("/", (req: Request, res: Response) => {
  return res.send("Hello World!");
});

// Test that DynamoDB connection is working
router.get(
  "/add-order",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tableName = "Orders";
      const item: OrderItem = {
        id: uuidv4(),
        time_created: Date.now(),
        bob_cost: 1221,
        jeremy_cost: 509,
      };
      const params: DynamoDBParams = {
        TableName: tableName,
        Item: item,
      };
      await docClient.put(params).promise();
      return res.status(200).send("Order added");
    } catch (err) {
      return next(err);
    }
  },
);

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
