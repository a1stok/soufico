import React from "react";
import ReactDOM from "react-dom/client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import App from "./App";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder_key_please_set_in_environment"); 

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
  <Elements stripe={stripePromise}>
    <App />
  </Elements>
);