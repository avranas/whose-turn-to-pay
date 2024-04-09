import React, { useEffect, useState } from "react";
import NewOrderInput, {
  NewOrderInputState,
} from "../NewOrderInput/NewOrderInput";
import AddNewInputButton from "../AddNewInputButton/AddNewInputButton";
import "./NewOrder.css";
import { v4 as uuidv4 } from "uuid";
import axios, { AxiosError } from "axios";
import { Cost } from "../../../types";

interface NewOrderProps {
  sortedNames: string[] | null
}

const NewOrder = ({sortedNames}: NewOrderProps) => {
  const [newOrderInputState, setNewOrderInputState] = useState<
    NewOrderInputState[]
  >([]);
  const [paidIndex, setPaidIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function deleteInput(index: number) {
    setNewOrderInputState((prev) => prev.filter((_, i) => i !== index));
  }

  function handleChange(index: number, newState: NewOrderInputState) {
    setNewOrderInputState((prev) => {
      const newArr = [...prev];
      newArr[index] = newState;
      return newArr;
    });
  }

  function createNewCost(amount: number, newName = "") {
    const newElements: NewOrderInputState[] = [];
    for (let i = 0; i < amount; i++) {
      newElements.push({ name: newName, amount: "0", id: uuidv4() });
    }
    setNewOrderInputState((prev) => prev.concat(newElements));
  }

  async function createNewOrder() {
    try {
      const duplicateCheck = new Set();
      for (let i = 0; i < newOrderInputState.length; i++) {
        const name = newOrderInputState[i].name;
        if (duplicateCheck.has(name)) {
          setErrorMessage("Duplicate names are not allowed");
          return;
        }
        duplicateCheck.add(name);
        if (name === "") {
          setErrorMessage("Name field cannot be blank");
          return;
        }
      }
      setErrorMessage("");
      const costs: Cost[] = newOrderInputState.map((input) => {
        return {
          name: input.name,
          amount: Number(input.amount.replace(".", "")),
        };
      });
      await axios.post("/api/order", {
        costs: costs,
        who_paid: newOrderInputState[paidIndex].name,
      });
      window.location.reload();
    } catch (err) {
      const msg =
        err instanceof AxiosError && typeof err.response?.data === "string"
          ? err.response.data
          : "An unknown error occurred";
      setErrorMessage(msg);
    }
  }

  function updateWhoPaid(index: number) {
    setPaidIndex(index);
  }

  useEffect(() => {
    if (sortedNames) {
      sortedNames.forEach(name => createNewCost(1, name));
    } else {
      createNewCost(2);
    }
  }, []);

  return (
    <div>
      <h2>Create a new order</h2>
      <div id="new-order-content">
        {newOrderInputState.map((state, i) => {
          return (
            <NewOrderInput
              key={state.id}
              deleteInput={deleteInput}
              index={i}
              state={state}
              updateState={handleChange}
              updateWhoPaid={updateWhoPaid}
            />
          );
        })}
        <AddNewInputButton createNewCost={createNewCost} />
      </div>
      {errorMessage && <p id="missing-name-error">{errorMessage}</p>}
      <button id="create-order-button" onClick={createNewOrder}>
        Create Order
      </button>
    </div>
  );
};

export default NewOrder;
