import React, { useState } from "react";
import "./NewOrderInput.css";

export interface NewOrderInputProps {
  name: string;
}

const NewOrderInput = ({ name }: NewOrderInputProps) => {
  const [amount, setAmount] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Removes any character that isn't a number
    let input = e.target.value.replace(/[^0-9]/g, "");
    // Removes leading zeroes
    while (input[0] === "0" && input.length > 1) input = input.slice(1);
    if (input.length > 2) {
      // Adds a decimal before the second digit 
      input = `${input.slice(0, -2)}.${input.slice(-2)}`;
    } else if (input.length == 1) {
      input = "0.0" + input;
    } else if (input.length == 2) {
      input = "0." + input;
    }
    setAmount(input);
  };

  return (
    <div className="new-order-input">
      <div className="input-name">
      {name ? <label>{name}</label> : <input type="name" />}</div>
      <div className="amount-input">
      $<input type="text" value={amount} onChange={handleChange} />
      </div>
    </div>
  );
};

export default NewOrderInput;
