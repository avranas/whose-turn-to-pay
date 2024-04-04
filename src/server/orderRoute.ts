import { Request, Response } from "express";
import orderController from "./orderController";
const express = require("express");

export const router = express.Router();

// Get all orders
router.get("/", orderController.getAllOrders, (req: Request, res: Response) => {
  return res.send(res.locals.orders);
});

// Create an order
router.get("/", orderController.createOrder, (req: Request, res: Response) => {
  return res.send("Order #" + res.locals.orderId + " created");
});

// Update an order
router.get(
  "/:id",
  orderController.updateOrder,
  (req: Request, res: Response) => {
    return res.send("Order #" + req.params.id + " created");
  },
);

// Delete an order
router.get(
  "/:id",
  orderController.deleteOrder,
  (req: Request, res: Response) => {
    return res.send("Order #" + req.params.id + " deleted");
  },
);
