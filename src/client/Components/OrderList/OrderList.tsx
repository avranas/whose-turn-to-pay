import React from "react";
import { OrderData, TotalMap } from "../../../types";
import "./OrderList.css";
import { centsToUSD } from "../../util";
import axios from "axios";

interface OrderListProps {
  orders: OrderData[];
  sortedNames: string[];
  orderCosts: { [key: string]: number }[];
  orderTotals: number[];
  totalMap: TotalMap;
}

const OrderList = ({
  orders,
  sortedNames,
  orderCosts,
  orderTotals,
  totalMap,
}: OrderListProps) => {

  async function deleteOrder(index: number) {
    try {
      console.log(index);
      console.log(orders[index].id)
      console.log(orders[index].who_paid)
      const res = await axios.delete("/api/order/" + orders[index].id);
      console.log(res.data);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }

  }

  return (
    <div>
      {
        <div>
          <h2>Order history</h2>
          <p>
            Whoever paid is highlighted in{" "}
            <span className="blue-text">blue</span>
          </p>
          <table>
            <thead>
              <tr>
                <th></th>
                {sortedNames.map((name, i) => {
                  return <th key={"order-col-" + i}>{name}</th>;
                })}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orderCosts.map((order, i) => {
                return (
                  <tr key={"order-row-" + i}>
                    <td>Order {orderCosts.length - i}</td>
                    {sortedNames.map((name) => {
                      const newField =
                        orders[i].who_paid === name ? (
                          <td
                            key={name + "-" + i}
                            style={{ backgroundColor: "skyBlue" }}
                          >
                            {centsToUSD(order[name])}
                          </td>
                        ) : (
                          <td key={name + "-" + i}>
                            {order[name] ? centsToUSD(order[name]) : "X"}
                          </td>
                        );
                      if (orders[i].who_paid) {
                        newField;
                      }
                      return newField;
                    })}
                    <td>{centsToUSD(orderTotals[i])}</td>
                    <td><button className="delete-button" onClick={() => deleteOrder(i)}>Delete order</button></td>
                  </tr>
                );
              })}
              <tr>
                <td>
                  <strong>Total</strong>
                </td>
                {sortedNames.map((name, i) => {
                  return (
                    <td key={"total-" + i}>{centsToUSD(totalMap[name])}</td>
                  );
                })}
                <td>
                  <strong>
                    {centsToUSD(
                      Object.values(totalMap).reduce((a, v) => a + v),
                    )}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      }
    </div>
  );
};

export default OrderList;
