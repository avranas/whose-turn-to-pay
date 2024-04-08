import React from "react";
import { OrderData } from "../../../types";
import "./Order.css";

interface OrderProps {
  order: OrderData;
}

const Order = ({ order }: OrderProps) => {
  return (
    <div>
      {order.costs.map((cost, i) => {
        return (
          <div key={`order-${order.id}-${i}`}>
            <p>{cost.name}</p>
            <p>{cost.amount}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Order;
