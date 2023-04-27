import * as React from "react";
import { useState, useEffect } from "react";
import { ICart } from "./interfacesForPayments";
import ServicesAndMerchandiseCheckout from "./ServicesAndMerchandiseCheckout";

const ReviewOrderForServicesAndMerchandise = (props: IProps) => {
  const [emailForReceipt, setEmailForReceipt] = useState<string>("");
  const [showStripeCheckout, setShowStripeCheckout] = useState<boolean>(false);
  const [cartTotal, setCartTotal] = useState<number>();
  const [cartItemsIdNumbersAndQuantities, setCartItemsIdNumbersAndQuantities] =
    useState<
      Array<{
        serviceOrMerchandiseId: number;
        quantity: number;
      }>
    >();

  useEffect(() => {
    let isMounted = true;
    let cartItemsIdNumbersAndQuatity: Array<{
      serviceOrMerchandiseId: number;
      quantity: number;
    }> = [];
    for (let y = 0; y < props.cart.length; y++) {
      cartItemsIdNumbersAndQuatity.push({
        serviceOrMerchandiseId: props.cart[y].id,
        quantity: props.cart[y].quantity,
      });
    }
    isMounted &&
      setCartItemsIdNumbersAndQuantities(cartItemsIdNumbersAndQuatity);
    fetch("/api/servicesAndMerchandise/getCartTotal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartItemsIdNumbersAndQuantities: cartItemsIdNumbersAndQuatity,
      }),
    })
      .then((res) => res.json())
      .then((res) => isMounted && setCartTotal(res.cartTotal))
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, []);

  let continueToPayment = () => {
    setShowStripeCheckout(true);
  };

  let paymentIntentsCreateError = () => {
    setShowStripeCheckout(false);
  };

  return (
    <div style={{ marginBottom: "3rem" }}>
      {cartTotal && (
        <>
          {!showStripeCheckout && (
            <div className="d-flex justify-content-center">
              <div
                style={{
                  border: "solid black 1px",
                  borderRadius: ".5rem",
                  paddingTop: "2rem",
                  paddingBottom: "2rem",
                }}
                className="d-flex justify-content-center flex-wrap col-sm-6 col-12"
              >
                <div className="d-flex justify-content-center flex-wrap">
                  {props.cart.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="col-12 d-flex justify-content-start flex-wrap"
                        style={{
                          padding: ".3rem",
                          border: "solid black 1px",
                          borderRadius: ".5rem",
                          margin: ".5rem",
                        }}
                      >
                        <span
                          className="col-12"
                          style={{ fontSize: "1.3rem", color: "" }}
                        >
                          {item.name_of_item}
                        </span>
                        {!item.has_recurring_payment_contract &&
                          item.date_units_id_for_expiration && (
                            <>
                              <p
                                style={{
                                  fontSize: ".6rem",
                                  backgroundColor: "yellow",
                                }}
                              >
                                Expires in{" "}
                                {item.number_of_date_units_for_expiration}{" "}
                                {Number(
                                  item.number_of_date_units_for_expiration
                                ) > 1
                                  ? item.unit
                                  : item.unit?.slice(0, item.unit.length - 1)}
                              </p>
                            </>
                          )}
                        <span
                          className="col-12"
                          style={{ fontSize: ".7rem", color: "gray" }}
                        >
                          Items included: {item.number_of_items_included}
                        </span>
                        <span
                          className="col-12"
                          style={{ fontSize: "1rem", color: "" }}
                        >
                          Quantity: {item.quantity}
                        </span>
                        <span
                          className="col-12"
                          style={{ fontSize: "1rem", color: "" }}
                        >
                          ${item.cost_of_item}
                        </span>

                        {item.has_recurring_payment_contract && (
                          <>
                            <p
                              style={{
                                fontSize: ".6rem",
                                backgroundColor: "yellow",
                              }}
                            >
                              Billed every{" "}
                              {item.number_of_date_units_for_expiration}{" "}
                              {Number(
                                item.number_of_date_units_for_expiration
                              ) > 1
                                ? item.unit
                                : item.unit?.slice(0, item.unit.length - 1)}
                            </p>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mb-3  col-12 p-0 text-center d-flex justify-content-center flex-wrap">
                  <span className="col-12 mb-1" style={{ fontSize: "1rem" }}>
                    <strong>Grand total:</strong> ${cartTotal}
                  </span>
                  <span className="col-12" style={{ fontSize: ".8rem" }}>
                    Email for reciept:
                  </span>
                  <div className="col-12 d-flex justify-content-center flex-wrap p-0">
                    <input
                      placeholder="email"
                      style={{ maxWidth: "13rem" }}
                      autoFocus
                      onChange={(e: any) =>
                        setEmailForReceipt(e.target.value.trim())
                      }
                      type="email"
                    />
                  </div>
                  {emailForReceipt && emailForReceipt.length > 0 && (
                    <button
                      onClick={continueToPayment}
                      className="mt-3 btn btn-success"
                    >
                      <span className="d-flex justify-content-center align-items-center">
                        Continue to payment
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
                          <path d="M5 12h13M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  )}
                </div>
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
              </div>
            </div>
          )}
          {showStripeCheckout && cartItemsIdNumbersAndQuantities && (
            <ServicesAndMerchandiseCheckout
              email={emailForReceipt}
              paymentIntentsCreateError={paymentIntentsCreateError}
              cancelCheckout={props.cancelCheckout}
              cartTotal={cartTotal}
              cartItemsIdNumbersAndQuantities={cartItemsIdNumbersAndQuantities}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ReviewOrderForServicesAndMerchandise;

interface IProps {
  cancelCheckout: Function;
  cart: ICart[];
}
