import React from "react";
import { createRoot } from "react-dom/client";
import OrderList from "./Components/OrderList/OrderList";
import NewOrder from "./Components/NewOrder/NewOrder";
import "./App.css";

const App = () => {
  return (
    <div>
      <h1>Whose turn is it to pay?</h1>
      <NewOrder />
      <OrderList />
    </div>
  );
};

const container = document.querySelector("#root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("Failed to find the root element");
}
