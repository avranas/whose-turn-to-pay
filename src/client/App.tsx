import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import OrderList from "./Components/OrderList/OrderList";
import NewOrder from "./Components/NewOrder/NewOrder";
import "./App.css";
import {
  Cost,
  CostMap,
  Difference,
  DifferenceMap,
  OrderData,
  SpendMap,
  TotalMap,
} from "../types";
import axios from "axios";
import PayingOrder from "./Components/PayingOrder/PayingOrder";

const App = () => {
  const [orders, setOrders] = useState<OrderData[] | null>(null);
  const [totalMap, setTotalMap] = useState<TotalMap | null>(null);
  const [spendMap, setSpendMap] = useState<SpendMap | null>(null);
  const [payingOrder, setPayingOrder] = useState<Difference[] | null>(null);
  const [sortedNames, setSortedNames] = useState<string[] | null>(null);
  const [orderCosts, setOrderCosts] = useState<
    { [key: string]: number }[] | null
  >(null);
  const [orderTotals, setOrderTotals] = useState<number[] | null>(null);

  useEffect(() => {
    async function contactBackend() {
      try {
        const res = await axios.get("/api/order");
        const orders: Array<OrderData> = res.data;
        const newCostMap: CostMap = {};
        const newTotalMap: TotalMap = {};
        const newSpendMap: SpendMap = {};
        orders.forEach(({ costs, who_paid }) => {
          let orderTotal = 0;
          costs.forEach((cost: Cost) => {
            if (cost.name in newCostMap) {
              newCostMap[cost.name].push(cost.amount);
              newTotalMap[cost.name] += cost.amount;
            } else {
              newCostMap[cost.name] = [cost.amount];
              newTotalMap[cost.name] = cost.amount;
            }
            if (!(cost.name in newSpendMap)) newSpendMap[cost.name] = 0;
            orderTotal += cost.amount;
          });
          if (who_paid in newSpendMap) newSpendMap[who_paid] += orderTotal;
        });
        const newDifferenceMap: DifferenceMap = {};
        Object.keys(newSpendMap).forEach((key) => {
          newDifferenceMap[key] = newSpendMap[key] - newTotalMap[key];
        });
        const newPayingOrder = Object.entries(newDifferenceMap)
          .sort((a, b) => a[1] - b[1])
          .map((coworker) => {
            return {
              name: coworker[0],
              amount: coworker[1],
            };
          });
        const newSortedNames = [...newPayingOrder]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((v) => v.name);
        const newOrderCosts = orders.map((order) => {
          const newMap: { [key: string]: number } = {};
          order.costs.forEach((c) => {
            newMap[c.name] = c.amount;
          });
          return newMap;
        });

        const newOrderTotals = orders.map((order) => {
          return order.costs.reduce((accumulator, currentItem) => {
            return accumulator + currentItem.amount;
          }, 0);
        });
        setOrderTotals(newOrderTotals);
        setOrderCosts(newOrderCosts);
        setSortedNames(newSortedNames);
        setPayingOrder(newPayingOrder);
        setSpendMap(newSpendMap);
        setTotalMap(newTotalMap);
        setOrders(orders);
      } catch (err) {
        console.log(err);
      }
    }
    contactBackend();
  }, []);

  if (
    !payingOrder ||
    !spendMap ||
    !totalMap ||
    !orders ||
    !sortedNames ||
    !orderCosts ||
    !orderTotals ||
    !totalMap ||
    !sortedNames
  )
    return <p>Loading...</p>;

  return (
    <div>
      <h1>Whose turn is it to pay?</h1>
      {
        <PayingOrder
          payingOrder={payingOrder}
          spendMap={spendMap}
          totalMap={totalMap}
        />
      }
      {<NewOrder sortedNames={sortedNames} />}
      {
        <OrderList
          orders={orders}
          sortedNames={sortedNames}
          orderCosts={orderCosts}
          orderTotals={orderTotals}
          totalMap={totalMap}
        />
      }
    </div>
  );
};

const container = document.querySelector("#root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("Failed to find the root element");
}
