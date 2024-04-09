import React from "react";
import "./PayingOrder.css";
import { Difference, SpendMap, TotalMap } from "../../../types";
import { centsToUSD } from "../../util";

interface PayingOrderProps {
  payingOrder: Difference[];
  spendMap: SpendMap;
  totalMap: TotalMap;
}

const PayingOrder: React.FC<PayingOrderProps> = ({
  payingOrder,
  spendMap,
  totalMap,
}) => {
  return (
    <div>
      <h2 id="turn-notice">It's {payingOrder[0].name}'s turn!</h2>
      {payingOrder.map((person, i) => {
        let message = `${person.name} ordered ${centsToUSD(totalMap[person.name])} in items, spent ${centsToUSD(spendMap[person.name])}, and is ${centsToUSD(Math.abs(person.amount))}`;
        if (person.amount < 0) {
          message += " in debt.";
        } else if (person.amount > 0) {
          message += " in the hole.";
        } else {
          message += " and has broken even!";
        }
        return <p key={`${person}-${i}`}>{message}</p>;
      })}
    </div>
  );
};
export default PayingOrder;
