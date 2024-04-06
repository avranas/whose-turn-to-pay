import axios from "axios";
import React, { useEffect, useState } from "react";
import { OrderData } from "../types";
import Order from "./Order";

const OrderList = () => {
  const [orders, setOrders] = useState<OrderData[] | null>(null);

  useEffect(() => {
    async function contactBackend() {
      try {
        const res = await axios.get("/api/order");
        console.log(res.data);
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    contactBackend();
  }, []);

  return (
    <div>
      <h2>Order List</h2>
      <ol>
        {orders == null ? (
          <p>Loading orders</p>
        ) : (
          orders.map((order, i) => <Order key={"order-" + i} order={order} />)
        )}
      </ol>
    </div>
  );
};

export default OrderList;
