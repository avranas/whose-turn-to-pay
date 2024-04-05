import { NextFunction, Request, RequestHandler, Response } from "express";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { HttpError } from "./types";
import DynamoDB, {
  PutItemInput,
  ScanInput,
} from "aws-sdk/clients/dynamodb";

const db = new AWS.DynamoDB.DocumentClient();
const tableName = "Orders";

interface OrderController {
  checkIfOrderIdExists: RequestHandler;
  getAllOrders: RequestHandler;
  createOrder: RequestHandler;
  updateOrder: RequestHandler;
  deleteOrder: RequestHandler;
}

// Throw an error if the object doesn't exist
export const orderController: OrderController = {
  checkIfOrderIdExists: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const getParams: DynamoDB.DocumentClient.GetItemInput = {
        TableName: tableName,
        Key: { id: req.params.id },
      };
      const getResult = await db.get(getParams).promise();
      // DynamoDB will return an empty object if it can't find the item
      if (!getResult.Item) {
        const error: HttpError = {
          status: 400,
          message: "An Order with that ID doesn't exist",
        };
        throw error;
      }
      return next();
    } catch (err) {
      return next(err);
    }
  },
  getAllOrders: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const params: ScanInput = {
        TableName: tableName,
      };
      const data = await db.scan(params).promise();
      res.locals.orders = data.Items;
      return next();
    } catch (err) {
      return next(err);
    }
  },
  createOrder: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const item: { [key: string]: any; id: string; time_created: number } = {
        id: uuidv4(),
        time_created: Date.now(),
      };
      const fields = [
        "bob_cost",
        "jeremy_cost",
        "coworker_a_cost",
        "coworker_b_cost",
        "coworker_c_cost",
        "coworker_d_cost",
        "coworker_e_cost",
      ];
      for (const field of fields) {
        if (!(field in req.body)) {
          const error: HttpError = {
            status: 400,
            message: field + " is missing from the request body",
          };
          throw error;
        }
        item[field] = req.body[field];
      }
      const params: PutItemInput = {
        TableName: tableName,
        Item: item,
      };
      await db.put(params).promise();
      res.locals.orderId = item.id;
      return next();
    } catch (err) {
      return next(err);
    }
  },
  updateOrder: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const updateExpression: Array<string> = [];
      const values: { [key: string]: any } = {};
      const names: { [key: string]: string } = {};
      Object.keys(req.body).forEach((key) => {
        updateExpression.push(`#${key} = :${key}`);
        values[`:${key}`] = req.body[key];
        names[`#${key}`] = key;
      });
      const putParams: DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: tableName,
        Key: { id: req.params.id },
        UpdateExpression: `set ${updateExpression.join(", ")}`,
        ExpressionAttributeValues: values,
        ExpressionAttributeNames: names,
        ReturnValues: "UPDATED_NEW",
      };
      const putResult = await db.update(putParams).promise();
      res.locals.updatedOrder = putResult.Attributes;
      return next();
    } catch (err) {
      return next(err);
    }
  },
  deleteOrder: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const params: DynamoDB.DocumentClient.DeleteItemInput = {
        TableName: tableName,
        Key: { id: req.params.id },
      };
      await db.delete(params).promise();
      res.locals.id = req.params.id;
      return next();
    } catch (err) {
      return next(err);
    }
  },
};

export default orderController;
