import { NextFunction, Request, RequestHandler, Response } from "express";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { HttpError } from "./types";
import { DeleteItemInput } from "aws-sdk/clients/dynamodb";

const db = new AWS.DynamoDB.DocumentClient();
const tableName = "Orders";

interface OrderController {
  getAllOrders: RequestHandler;
  createOrder: RequestHandler;
  updateOrder: RequestHandler;
  deleteOrder: RequestHandler;
}

export const orderController: OrderController = {
  getAllOrders: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const params = {
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
      const id = uuidv4();
      const params = {
        TableName: tableName,
        Item: item,
      };
      await db.put(params).promise();
      res.locals.orderId = id;
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
      const params = {
        TableName: tableName,
        Key: { id: req.params.id },
        UpdateExpression: `set ${updateExpression.join(", ")}`,
        ExpressionAttributeValues: values,
        ExpressionAttributeNames: names,
        ReturnValues: "UPDATED_NEW",
      };
      const result = await db.update(params).promise();
      res.locals.updatedOrder = result.Attributes;
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
      const params: DeleteItemInput = {
        TableName: tableName,
        Key: { id: { S: req.params.id } },
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
