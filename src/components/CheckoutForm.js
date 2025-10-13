import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const CheckoutForm = ({ amount, currency }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      localStorage.getItem("clientSecret"),
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    );

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      console.log("Payment Intent:", paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success ? (
        <p style={{ color: "green" }}>Payment Successful!</p>
      ) : (
        <button type="submit" disabled={!stripe}>
          Pay {currency} {amount}
        </button>
      )}
    </form>
  );
};

export default CheckoutForm;
