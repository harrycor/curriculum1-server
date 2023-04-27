import * as React from "react";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "./StripeCheckoutForm";
import { ICart } from "./interfacesForPayments";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// const stripePromise = loadStripe(
//   "pk_test_51LZzJCJsiFBikHG82VaSWAj2PCkZJKQZIN6a31tuY6KZ2dz2Pl1Sxp7ZGP5V4LlpZ5vl2km6zjkY4VvPAJJ2MrkO00C4uA7WHa",
//   { stripeAccount: "acct_1LcFQaQpQutCrOys" }
// );
// const stripePromise = loadStripe(
//   "pk_test_51LZzJCJsiFBikHG82VaSWAj2PCkZJKQZIN6a31tuY6KZ2dz2Pl1Sxp7ZGP5V4LlpZ5vl2km6zjkY4VvPAJJ2MrkO00C4uA7WHa",
//   {
//     stripeAccount: `${}`,
//   }
// )

const ServicesAndMerchandiseCheckout = (props: IProps) => {
  const [tenantStripeAccountId, setTenantStripeAccountId] = useState<string>();
  const [stripePromise, setStripePromise] = useState<any>();
  let token = localStorage.getItem("token");
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    let isMounted = true;
    if (tenantStripeAccountId && !stripePromise) {
      //"This is super hacky" ~Jason ... it is though. i am suppost to do this ouside of the component so idont keep getting apromise every render, but ithink ive hanlded it properly
      // console.log(tenantStripeAccountId * 1); //I did this to trow an error its a reminder to set the PK back to live... DONT FORGET HARRY!
      isMounted &&
        setStripePromise(
          loadStripe(
            // put back ot live before pushing to main
            "pk_live_51LYdR6Ldn4xJam7cuav0uXxzDqcyAmzd3mjapS75Y8qYuP66gZMY5Plb6Nu9CMEeqQdgBItai242PMG1JXEQuFgH00SAFqSqbD",
            // "pk_test_51LZzJCJsiFBikHG82VaSWAj2PCkZJKQZIN6a31tuY6KZ2dz2Pl1Sxp7ZGP5V4LlpZ5vl2km6zjkY4VvPAJJ2MrkO00C4uA7WHa",
            { stripeAccount: tenantStripeAccountId }
          )
        );
    }
    return () => {
      isMounted = false;
    };
  }, [tenantStripeAccountId]);

  useEffect(() => {
    let isMounted = true;
    // Create PaymentIntent as soon as the page loads
    fetch("/api/stripeAccounts/getConnectAccountId", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(
        (res) => isMounted && setTenantStripeAccountId(res[0].stripe_account_id)
      )
      .catch((err) => console.log(err));
    fetch("/api/stripeAccounts/createPaymentIntent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: props.email,
        cartItemsIdNumbersAndQuantities: props.cartItemsIdNumbersAndQuantities,
        // items: props.cartItems,
        // cartTotal: props.cartTotal,
        // description: props.recieptDescription,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          isMounted && setClientSecret(data.clientSecret);
        } else {
          alert(data.message);
          props.paymentIntentsCreateError();
        }
      })
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    // appearance,
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <div
          style={{ border: "solid black 1px", borderRadius: ".3rem" }}
          className="col-md-6 col-12"
        >
          <div className="mt-2 mb-2 col-12 d-flex justify-content-center flex-wrap">
            <span className="col-12 text-center" style={{ fontSize: "2rem" }}>
              Checkout
            </span>
            <span className="col-12 text-center" style={{ fontSize: "1.2rem" }}>
              Total: ${props.cartTotal}
            </span>
          </div>
          <div className="App" style={{ marginBottom: "3rem" }}>
            {clientSecret && (
              <>
                <Elements options={options} stripe={stripePromise}>
                  <StripeCheckoutForm />
                </Elements>
                <div className="mt-1 col-12 text-center d-flex justify-content-center flex-wrap">
                  <span
                    className="mb-2 col-12 text-center"
                    style={{ fontSize: "1rem" }}
                  >
                    or
                  </span>
                  <button
                    onClick={() => props.cancelCheckout()}
                    className="btn btn-info"
                  >
                    <span className="d-flex justify-content-center align-items-center">
                      <svg
                        // xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="bevel"
                      >
                        <path d="M19 12H6M12 5l-7 7 7 7" />
                      </svg>
                      Continue shopping
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div
        className="col-12 justify-content-center text-center"
        style={{ fontSize: ".7rem" }}
      >
        <span>
          If you are having trouble checking out, please make sure you are at{" "}
          <a
            style={{ color: "blue" }}
            href="https://www.wrestlingcurriculum.com/"
            target={"_blank"}
          >
            https://www.wrestlingcurriculum.com
          </a>{" "}
          <br />
          (if you do not have "https://" it will not work)
        </span>
      </div>
    </>
  );
};

export default ServicesAndMerchandiseCheckout;

interface IProps {
  email: string;
  paymentIntentsCreateError: Function;
  cancelCheckout: Function;
  cartTotal: number;
  cartItemsIdNumbersAndQuantities: Array<{
    serviceOrMerchandiseId: number;
    quantity: number;
  }>;
}
