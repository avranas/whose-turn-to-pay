import { Request, Response } from "express";
import orderController from "./orderController";
const express = require("express");

const router = express.Router();

// Get all orders
router.get("/", orderController.getAllOrders, (req: Request, res: Response) => {
  return res.send(res.locals.orders);
});

// Create an order
router.post("/", orderController.createOrder, (req: Request, res: Response) => {
  return res.status(201).send("Order #" + res.locals.orderId + " created");
});

// Update an order
router.put(
  "/:id",
  orderController.checkIfOrderExists,
  orderController.updateOrder,
  (req: Request, res: Response) => {
    return res.send("Order #" + req.params.id + " updated");
  },
);

// Delete an order
router.delete(
  "/:id",
  orderController.checkIfOrderExists,
  orderController.deleteOrder,
  (req: Request, res: Response) => {
    return res.send("Order #" + req.params.id + " deleted");
  },
);

module.exports = router;
