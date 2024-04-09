import React from "react";
import "./AddNewInputButton.css";

interface AddNewInputButtonProps {
  createNewCost: (amount: number) => void;
}

const AddNewInputButton: React.FC<AddNewInputButtonProps> = ({ createNewCost }) => {
  function handleClick() {
    createNewCost(1);
  }
  return (
    <button className="important-button" id="add-new-input-button" onClick={handleClick}>
      Add new person
    </button>
  );
};

export default AddNewInputButton;
