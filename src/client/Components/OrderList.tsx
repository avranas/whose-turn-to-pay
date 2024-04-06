import axios from "axios";
import React, { useEffect, useState } from "react";
import { OrderData, Cost } from "../../types";
import Order from "./Order";

interface CoworkerCostMap {
  [key: string]: Array<number>;
}

interface CoworkerTotalMap {
  [key: string]: number;
}

interface CoworkerDifferenceMap extends CoworkerTotalMap {}
interface CoworkerSpentMap extends CoworkerTotalMap {}

const OrderList = () => {
  const [orders, setOrders] = useState<OrderData[] | null>(null);
  const [coworkerCostMap, setCoworkerCostMap] =
    useState<CoworkerCostMap | null>(null);
  const [coworkerTotalMap, setCoworkerTotalMap] =
    useState<CoworkerTotalMap | null>(null);
    const [coworkerSpentMap, setCoworkerSpentMap] =
      useState<CoworkerSpentMap | null>(null);
    // const [coworkerDifferenceMap, setCoworkerDifferenceMap] =
    //   useState<CoworkerDifferenceMap | null>(null);

    // TODO NEXT: I forgot to include which coworker paid in each order. Figure that
    // out and then come back here


  useEffect(() => {
    async function contactBackend() {
      try {
        const res = await axios.get("/api/order");
        const orders: Array<OrderData> = res.data;
        const costMap: CoworkerCostMap = {};
        orders.forEach((order) => {
          order.costs.forEach((cost: Cost) => {
            if (cost.name in costMap) {
              costMap[cost.name].push(cost.amount);
            } else {
              costMap[cost.name] = [cost.amount];
            }
          });
        });
        const totalMap: CoworkerTotalMap = {};
        Object.keys(costMap).forEach((key) => {
          const total = costMap[key].reduce((a: number, b: number) => a + b);
          totalMap[key] = total;
        });
        setCoworkerCostMap(costMap);
        setCoworkerTotalMap(totalMap);
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    contactBackend();
  }, []);
  console.log(orders);
  console.log(coworkerCostMap);
  console.log(coworkerTotalMap);
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
