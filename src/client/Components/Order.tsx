import React from "react";
import { OrderData } from "../../types";

interface OrderProps {
  order: OrderData;
}

const Order = ({ order }: OrderProps) => {
  return (
    <div>{/* <div><div>Bob</div><div>{order.costs[i]}</div></div> */}</div>
  );
};

export default Order;
