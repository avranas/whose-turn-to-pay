import axios from "axios";
import React, { useEffect, useState } from "react";
import { OrderData, Cost } from "../../../types";
import "./OrderList.css";
import { centsToUSD } from "../../util";

interface CostMap {
  [key: string]: Array<number>;
}

interface TotalMap {
  [key: string]: number;
}

interface DifferenceMap {
  [key: string]: number;
}

interface SpendMap {
  [key: string]: number;
}

interface Difference {
  name: string;
  amount: number;
}

const OrderList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<OrderData[] | null>(null);
  const [costMap, setCostMap] = useState<CostMap | null>(null);
  const [totalMap, setTotalMap] = useState<TotalMap | null>(null);
  const [spendMap, setSpendMap] = useState<SpendMap | null>(null);
  const [differenceMap, setDifferenceMap] = useState<DifferenceMap | null>(
    null,
  );
  const [payingOrder, setPayingOrder] = useState<Array<Difference> | null>(
    null,
  );
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
        const newSortedNames = newPayingOrder
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
        setDifferenceMap(newDifferenceMap);
        setSpendMap(newSpendMap);
        setCostMap(newCostMap);
        setTotalMap(newTotalMap);
        setOrders(orders);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    contactBackend();
  }, []);
  console.log("orders", orders);
  console.log("costMap", costMap);
  console.log("totalMap", totalMap);
  console.log("spendMap", spendMap);
  console.log("differenceMap", differenceMap);
  console.log("payingOrder", payingOrder);
  console.log("orderTotals", orderTotals);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {!orders ||
      !sortedNames ||
      !spendMap ||
      !orderCosts ||
      !orderTotals ||
      !totalMap ? (
        <p>Loading orders</p>
      ) : (
        <div>
          <h2>Order history</h2>
          <table>
            <thead>
              <tr>
                <th></th>
                {sortedNames.map((name) => {
                  return <th>{name}</th>;
                })}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orderCosts.map((order, i) => {
                return (
                  <tr>
                    <td>Order {orderCosts.length - i}</td>
                    {sortedNames.map((name) => {
                      const newField =
                        orders[i].who_paid === name ? (
                          <td style={{ backgroundColor: "skyBlue" }}>
                            {centsToUSD(order[name])}
                          </td>
                        ) : (
                          <td>{order[name] ? centsToUSD(order[name]) : 0}</td>
                        );
                      if (orders[i].who_paid) {
                        newField;
                      }
                      return newField;
                    })}
                    <td>{centsToUSD(orderTotals[i])}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <td>
                <strong>Total</strong>
              </td>
              {sortedNames.map((name) => {
                return <th>{centsToUSD(totalMap[name])}</th>;
              })}
              <td></td>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;
