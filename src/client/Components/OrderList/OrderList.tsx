import axios from "axios";
import React, { useEffect, useState } from "react";
import { OrderData, Cost, SpendMap, TotalMap, CostMap } from "../../../types";
import "./OrderList.css";
import { centsToUSD } from "../../util";

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
                    {sortedNames.map((name, i) => {
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
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      }
    </div>
  );
};

export default OrderList;
