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

interface CoworkerDifference {
  name: string;
  amount: number;
}

interface CoworkerDifferenceMap extends CoworkerTotalMap {}
interface CoworkerSpendMap extends CoworkerTotalMap {}

const OrderList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<OrderData[] | null>(null);
  const [coworkerCostMap, setCoworkerCostMap] =
    useState<CoworkerCostMap | null>(null);
  const [coworkerTotalMap, setCoworkerTotalMap] =
    useState<CoworkerTotalMap | null>(null);
  const [coworkerSpendMap, setCoworkerSpendMap] =
    useState<CoworkerSpendMap | null>(null);
  const [coworkerDifferenceMap, setCoworkerDifferenceMap] =
    useState<CoworkerDifferenceMap | null>(null);
  const [coworkerPayingOrder, setCoworkerPayingOrder] =
    useState<Array<CoworkerDifference> | null>(null);
  useEffect(() => {
    async function contactBackend() {
      try {
        const res = await axios.get("/api/order");
        const orders: Array<OrderData> = res.data;
        const costMap: CoworkerCostMap = {};
        const totalMap: CoworkerTotalMap = {};
        const spendMap: CoworkerSpendMap = {};
        orders.forEach(({ costs, who_paid }) => {
          let orderTotal = 0;
          costs.forEach((cost: Cost) => {
            if (cost.name in costMap) {
              costMap[cost.name].push(cost.amount);
              totalMap[cost.name] += cost.amount;
            } else {
              costMap[cost.name] = [cost.amount];
              totalMap[cost.name] = cost.amount;
            }
            if (!(cost.name in spendMap)) spendMap[cost.name] = 0;
            orderTotal += cost.amount;
          });
          if (who_paid in spendMap) spendMap[who_paid] += orderTotal;
        });
        const diffMap: CoworkerSpendMap = {};
        Object.keys(spendMap).forEach((key) => {
          diffMap[key] = spendMap[key] - totalMap[key];
        });
        const payingOrder = Object.entries(diffMap)
          .sort((a, b) => a[1] - b[1])
          .map((coworker) => {
            return {
              name: coworker[0],
              amount: coworker[1],
            };
          });
        setCoworkerPayingOrder(payingOrder);
        setCoworkerDifferenceMap(diffMap);
        setCoworkerSpendMap(spendMap);
        setCoworkerCostMap(costMap);
        setCoworkerTotalMap(totalMap);
        setOrders(orders);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    contactBackend();
  }, []);
  console.log("orders", orders);
  console.log("coworkerCostMap", coworkerCostMap);
  console.log("coworkerTotalMap", coworkerTotalMap);
  console.log("coworkerSpendMap", coworkerSpendMap);
  console.log("coworkerDifferenceMap", coworkerDifferenceMap);
  console.log("coworkerPayingOrder", coworkerPayingOrder);

  if (isLoading) {
    return <div>Loading...</div>;
  }
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
