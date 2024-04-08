import React from "react";
import "./AddNewInputButton.css";

interface AddNewInputButtonProps {
  createNewCost: (amount: number) => void;
}

const AddNewInputButton = ({createNewCost}: AddNewInputButtonProps) => {
  function handleClick() {
    createNewCost(1);
  }
  return (
    <button id="add-new-input-button" onClick={handleClick}>
      +
    </button>
  );
};

export default AddNewInputButton;
