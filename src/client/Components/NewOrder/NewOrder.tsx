import React, { useEffect, useState } from "react";
import NewOrderInput, {
  NewOrderInputProps,
} from "../NewOrderInput/NewOrderInput";
import AddNewInputButton from "../AddNewInputButton/AddNewInputButton";
import "./NewOrder.css";

const NewOrder = () => {
  const [newOrderInputs, setNewOrderInputs] = useState<
    React.ReactElement<NewOrderInputProps>[]
  >([]);
  function createNewCost(amount: number) {
    const newCosts = [];
    for (let i = 0; i < amount; i++) {
      newCosts.push(
        <NewOrderInput
          key={"new-order-input-" + newOrderInputs.length + newCosts.length}
          name={"steveee"}
        />,
      );
    }
    setNewOrderInputs([...newOrderInputs, ...newCosts]);
  }

  useEffect(() => {
    createNewCost(2);
  }, []);

  return (
    <div id="new-order">
      <label></label>
      {newOrderInputs}
      {/* <NewOrderInput name={"steve"} /> */}
      <AddNewInputButton createNewCost={createNewCost} />
    </div>
  );
};

export default NewOrder;
