import axios from "axios";
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import OrderList from "./Components/OrderList";

const App = () => {
  useEffect(() => {
    async function contactBackend() {
      try {
        const res = await axios.get("/api/order");
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    contactBackend();
  }, []);

  return (
    <div>
      <h1>Hello world</h1>
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
