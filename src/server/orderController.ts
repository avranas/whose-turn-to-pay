import { NextFunction, Request, RequestHandler, Response } from "express";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { Cost, Item } from "./types";
import DynamoDB, { PutItemInput, ScanInput } from "aws-sdk/clients/dynamodb";
import { batchValidateObj, createError, validateObj } from "./util";

const db = new AWS.DynamoDB.DocumentClient();
const tableName = "Orders";

interface OrderController {
  checkIfOrderExists: RequestHandler;
  getAllOrders: RequestHandler;
  createOrder: RequestHandler;
  updateOrder: RequestHandler;
  deleteOrder: RequestHandler;
}

// Throw an error if the object doesn't exist
// Sets res.locals.item equal to the retrieved item
export const orderController: OrderController = {
  checkIfOrderExists: async (
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
        throw createError(400, "An order with that ID doesn't exist");
      }
      res.locals.item = getResult.Item;
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
      const errors = batchValidateObj(req.body.costs, "costs", [
        {
          key: "amount",
          type: "number",
        },
        {
          key: "name",
          type: "string",
        },
      ]);
      if (errors !== "") {
        throw createError(
          400,
          "Error in the costs property of the request body: " + errors,
        );
      }
      const item: Item = {
        id: uuidv4(),
        time_created: Date.now(),
        costs: req.body.costs,
      };
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
      const error = validateObj(req.body, [
        {
          key: "amount",
          type: "number",
        },
        {
          key: "name",
          type: "string",
        },
      ]);
      if (error !== "") {
        throw createError(400, "Error in the the request body: " + error);
      }
      const { amount, name } = req.body;
      let updated = false;
      const newCosts = res.locals.item.costs.map((cost: Cost) => {
        if (cost.name === name) {
          cost.amount = amount;
          updated = true;
        }
        return cost;
      });
      if (!updated) {
        throw createError(
          400,
          "Unable to find any matching names. No update has taken place",
        );
      }
      const params: DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: tableName,
        Key: { id: req.params.id },
        UpdateExpression: "set costs = :costs",
        ExpressionAttributeValues: {
          ":costs": newCosts,
        },
      };
      const putResult = await db.update(params).promise();
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

/*
{
  Example new order JSON:
    "costs": [
        {
            "name": "Bob",
            "amount": 573
        }, {
            "name": "Jeremy",
            "amount": 650
        } , {
            "name": "Coworker A",
            "amount": 590
        } , {
            "name": "Coworker B",
            "amount": 799
        } , {
            "name": "Coworker C",
            "amount": 324
        } , {
            "name": "Coworker D",
            "amount": 650
        } ,{
            "name": "Coworker E",
            "amount": 1073
        } 

    ]
}
*/
