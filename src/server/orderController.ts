import { NextFunction, Request, RequestHandler, Response } from "express";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { Cost, Item } from "../types";
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

// Returns true if whoPaid is in the costs array, false otherwise
function whoPaidIsInCosts(whoPaid: string, costs: Array<Cost>): boolean {
  let foundWhoPaid = false;
  costs.forEach((cost: Cost) => {
    if (cost.name === whoPaid) foundWhoPaid = true;
  });
  return foundWhoPaid;
}

// Returns true if all costs are 0 or higher, false otherwise
function costsAreNotNegative(costs: Array<Cost>): boolean {
  for (let i = 0; i < costs.length; i++) {
    if (costs[i].amount < 0) return false;
  }
  return true;
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
      if (data.Items) {
        data.Items = data.Items.sort((a, b) => b.time_created - a.time_created);
      }

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
      const { costs, who_paid } = req.body;
      const error = validateObj(req.body, [
        {
          key: "costs",
          type: "object",
        },
        {
          key: "who_paid",
          type: "string",
        },
      ]);
      if (error !== "") {
        throw createError(400, "Error in the the request body: " + error);
      }
      const errors = batchValidateObj(costs, "costs", [
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
      // Throw an error if who_paid is not included in the list of costs
      if (!whoPaidIsInCosts(who_paid, costs)) {
        throw createError(
          400,
          who_paid + " is not included in the list of costs",
        );
      }
      // Throw an error if one of the costs is negative
      if (!costsAreNotNegative(costs)) {
        throw createError(400, "All costs must be positive");
      }
      const item: Item = {
        id: uuidv4(),
        time_created: Date.now(),
        costs,
        who_paid,
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
    const { amount, name, who_paid } = req.body;
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
        {
          key: "who_paid",
          type: "string",
        },
      ]);
      if (error !== "") {
        throw createError(400, "Error in the the request body: " + error);
      }
      if (amount < 0) {
        throw createError(400, '"amount" must not be negative');
      }
      let updated = false;
      const newCosts = res.locals.item.costs.map((cost: Cost) => {
        if (cost.name === name) {
          cost.amount = amount;
          updated = true;
        }
        return cost;
      });
      if (who_paid !== res.locals.item.who_paid) updated = true;
      if (!whoPaidIsInCosts(who_paid, newCosts)) {
        throw createError(
          400,
          who_paid + " is not included in the updated list of costs",
        );
      }
      if (!updated) {
        throw createError(400, "Unable to find anything to update");
      }
      const params: DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: tableName,
        Key: { id: req.params.id },
        UpdateExpression: "set costs = :costs, who_paid = :whoPaid",
        ExpressionAttributeValues: {
          ":costs": newCosts,
          ":whoPaid": who_paid,
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
