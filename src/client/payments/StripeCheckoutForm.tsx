import * as React from "react";
import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const StripeCheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null | any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState<boolean>(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }: any) => {
        switch (paymentIntent.status) {
          case "succeeded":
            setMessage("Payment succeeded!");
            break;
          case "processing":
            setMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            break;
          default:
            setMessage("Something went wrong.");
            break;
        }
      });
  }, [stripe]);

  const handleSubmit = async (e: any) => {
    setProcessingPayment(true);
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setProcessingPayment(false);
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url:
          "https://www.wrestlingcurriculum.com/thankYouForYourPurchase",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setProcessingPayment(false);
      setMessage(error.message);
    } else {
      setProcessingPayment(false);
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="d-flex justify-content-center flex-wrap">
        {/* Show any error or success messages */}
        {message && (
          <div
            style={{
              fontSize: "2rem",
              width: "100%",
              color: `${message !== "Payment succeeded!" ? "red" : "black"}`,
            }}
            className="text-center"
          >
            {message} <br />
            <span style={{ fontSize: "1rem", color: "black" }}>
              Please try again.
            </span>
          </div>
        )}
        <form id="payment-form" onSubmit={handleSubmit}>
          <PaymentElement id="payment-element" />
          <button
            disabled={isLoading || !stripe || !elements}
            id="submit"
            style={{
              width: "100%",
              marginTop: "1.5rem",
              padding: "12px 16px",
              fontFamily: "Arial, sans-serif",
              background: "#5469d4",
              color: "#ffffff",
              boxShadow: "0px 4px 5.5px 0px rgba(0, 0, 0, 0.07)",
              border: 0,
              borderRadius: "4px",
            }}
          >
            <span id="button-text">
              {isLoading ? (
                <div className="spinner" id="spinner"></div>
              ) : (
                "Pay now"
              )}
            </span>
          </button>
        </form>
      </div>
      {processingPayment && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "LightGray",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 100,
          }}
          className="d-flex justify-content-center align-items-center flex-wrap"
        >
          <div className="col-12 text-center d-flex justify-content-center flex-wrap">
            <span className="col-12 text-center" style={{ fontSize: "2rem" }}>
              Processing Payment...
            </span>
            <div
              style={{
                border: "10px solid #f3f3f3",
                borderTop: "7px solid #3498db",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                animation: "spin 1s linear infinite",
              }}
            ></div>
          </div>
        </div>
      )}
    </>
  );
};

export default StripeCheckoutForm;
