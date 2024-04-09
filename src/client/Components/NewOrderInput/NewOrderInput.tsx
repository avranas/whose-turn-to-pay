import React from "react";
import "./NewOrderInput.css";

export interface InputState {
  amount: string;
  name: string;
  id: string;
}

export interface NewOrderInputProps {
  index: number;
  deleteInput: (index: number) => void;
  updateState: (index: number, newState: InputState) => void;
  updateWhoPaid: (index: number) => void;
  state: {
    amount: string;
    name: string;
    id: string;
  };
}

const NewOrderInput: React.FC<NewOrderInputProps> = ({
  index,
  deleteInput,
  state,
  updateState,
  updateWhoPaid,
}) => {
  function setName(newName: string) {
    const newState = { ...state };
    newState.name = newName;
    updateState(index, newState);
  }

  function setAmount(newAmount: string) {
    const newState = { ...state };
    newState.amount = newAmount;
    updateState(index, newState);
  }

  function handleDeleteClick() {
    deleteInput(index);
  }

  function updateName(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function handleWhoPaidChange() {
    updateWhoPaid(index);
  }

  function updateAmount(e: React.ChangeEvent<HTMLInputElement>) {
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
  }

  return (
    <div className="new-order-input">
      <div className="input-header">
        <div>
          <input
            alt="Who paid"
            type="radio"
            name="drone"
            className="who-paid-button"
            defaultChecked={index === 0}
            onChange={handleWhoPaidChange}
          />
          Paid
        </div>
        <div className="delete-input" onClick={handleDeleteClick}>
          x
        </div>
      </div>
      <div className="new-order-input-content">
        <label className="name-label">Name</label>
        <div className="input-name">
          <input
            aria-label="Name field"
            onChange={updateName}
            className="name-input"
            type="text"
            value={state.name}
          />
        </div>
        <div className="amount-input">
          <div className="dollar-sign">$</div>
          <input
            aria-label="Cost field"
            className="name-input"
            type="text"
            value={state.amount}
            onChange={updateAmount}
          />
        </div>
      </div>
    </div>
  );
};

export default NewOrderInput;
