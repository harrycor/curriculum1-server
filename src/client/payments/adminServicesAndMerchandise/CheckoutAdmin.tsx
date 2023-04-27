import * as React from "react";
import { useState, useEffect } from "react";
import { IUsersForTenant } from "../interfacesForPayments";
import { ICart } from "../interfacesForPayments";
import Select from "react-select";
import * as date from "../../services/dateAndTimeFunctions";
import CollectPaymentAdmin from "./CollectPaymentAdmin";
import moment from "moment";

const CheckoutAdmin = (props: IProps) => {
  const [allUsers, setAllUsers] = useState<IUsersForTenant[]>();
  const [selectedUserId, setSelectedUserId] = useState<number>();
  const [submitProcessing, setSubmitProcessing] = useState<boolean>(false);
  const [continueToPayment, setContinueToPayment] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();

  let token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch("/api/users/getAllUsersInTenantWithNames", requestOptions)
      .then((res) => res.json())
      .then((res) => isMounted && setAllUsers(res))
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, []);

  let handleWrestlerSelect = (e: any) => {
    setSelectedUserId(e.id);
  };

  let handleSubmit = () => {
    if (!confirm("Are you sure you want to submit purchase?")) return;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        selectedUserId,
        cart: props.cart,
        todaysDateAndTime: date.createMomentCurrentDateTime(),
      }),
    };
    setSubmitProcessing(true);
    fetch(
      "/api/transactions/insertTransactionMadeByAdminCashPay",
      requestOptions
    )
      .then((res) => res.json())
      .then((res) => {
        alert(res.message);
        // setSubmitProcessing(false);
        props.handleShowAdminInsertServicesFunc();
      })
      .catch((err) => {
        console.log(err);
        setSubmitProcessing(false);
      });
  };

  let handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  let handleContinueToPayment = () => {
    if (!email) {
      alert("needs email");
      return;
    }
    setContinueToPayment(true);
  };
  let handleCancelPayment = () => {
    setContinueToPayment(false);
  };

  let handleContinueShopping = () => props.cancelCheckout();

  return (
    <div>
      <div className="text-center">
        <h3>Checkout</h3>
      </div>
      <div style={{ display: `${continueToPayment ? "none" : "block"}` }}>
        {allUsers && (
          <div className="App p-1 d-flex justify-content-center col-12 flex-wrap">
            <div className="col-12 text-center">
              <span>Select a wrestler</span>
            </div>
            <div className="col-md-5 col-10">
              <Select
                // defaultValue={selectedUserId}
                options={allUsers}
                getOptionLabel={(option) => {
                  return `${option.first_name ? option.first_name : "N/A"} ${
                    option.last_name ? option.last_name : ""
                  }`;
                }}
                getOptionValue={(option) => {
                  return `${option.id}`;
                }}
                onChange={handleWrestlerSelect}
              />
            </div>{" "}
            {props.payingCard && (
              <div className=" mt-2 col-12 d-flex flex-wrap justify-content-center">
                <label className="col-12 text-center m-0" htmlFor="email">
                  Email for receipt:
                </label>
                <input
                  placeholder="email"
                  onChange={handleEmailChange}
                  type="email"
                  name="email"
                  style={{ maxWidth: "12rem" }}
                />
              </div>
            )}
          </div>
        )}

        <div className="col-12">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Item</th>
                <th># of items included</th>
                <th>Expires</th>
                {props.payingCard && <th>Recurring billing</th>}
                <th>Quantity</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {props.cart.map((cartItem) => {
                return (
                  <tr key={cartItem.id}>
                    <td>{cartItem.name_of_item}</td>
                    <td>{cartItem.number_of_items_included}</td>
                    {/* <td>{cartItem.}</td> */}
                    <td>
                      {cartItem.date_units_id_for_expiration &&
                      cartItem.number_of_date_units_for_expiration ? (
                        <span>
                          {cartItem.number_of_date_units_for_expiration}{" "}
                          {Number(
                            cartItem.number_of_date_units_for_expiration
                          ) > 1
                            ? cartItem.unit
                            : cartItem.unit?.slice(0, cartItem.unit.length - 1)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    {props.payingCard && (
                      <td>
                        {cartItem.has_recurring_payment_contract ? (
                          <div className="d-flex flex-wrap">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="19"
                              height="19"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#14e726"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="9 11 12 14 22 4"></polyline>
                              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                            </svg>
                            <div className="col-12 p-0">
                              <span style={{ fontSize: ".7rem" }}>
                                <span style={{ whiteSpace: "nowrap" }}>
                                  next billing period:{" "}
                                </span>{" "}
                                <br />
                                <strong style={{ whiteSpace: "nowrap" }}>
                                  {moment()
                                    .add(
                                      cartItem.number_of_date_units_for_expiration,
                                      cartItem.unit
                                    )
                                    .format("MM/DD/YY")}
                                </strong>
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="19"
                              height="19"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#e71414"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 3h18v18H3zM15 9l-6 6m0-6l6 6" />
                            </svg>
                          </div>
                        )}
                      </td>
                    )}
                    <td>{cartItem.quantity}</td>
                    <td>${cartItem.cost_of_item}</td>
                  </tr>
                );
              })}
              <tr className="table-dark" style={{ color: "black" }}>
                <td></td>
                <td></td>
                {props.payingCard && <td></td>}
                <td></td>
                <td>
                  <strong>Total:</strong>
                </td>
                <td>
                  <span>
                    $
                    <strong style={{ color: "green" }}>
                      {props.cartTotal}
                    </strong>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-12 d-flex justify-content-center flex-wrap">
          <div className="col-12 d-flex justify-content-center">
            {props.payingCash && (
              <button
                onClick={handleSubmit}
                disabled={
                  selectedUserId && submitProcessing === false ? false : true
                }
                className=" mt-1 mb-1 btn btn-success"
              >
                {submitProcessing ? "Processing..." : "Submit cash pay"}
              </button>
            )}
            {props.payingCard && (
              <button
                onClick={handleContinueToPayment}
                disabled={
                  email && selectedUserId && submitProcessing === false
                    ? false
                    : true
                }
                className=" mt-1 mb-1 btn btn-success"
              >
                {"Continue to payment"}
              </button>
            )}
          </div>
          <button
            disabled={submitProcessing}
            onClick={handleContinueShopping}
            className="btn btn-sm btn-dark"
          >
            Continue shopping
          </button>
        </div>
      </div>
      {continueToPayment && email && selectedUserId && (
        <div style={{ display: `${continueToPayment ? "block" : "none"}` }}>
          <CollectPaymentAdmin
            cancelPayment={handleCancelPayment}
            email={email}
            paymentIntentsCreateError={handleCancelPayment}
            // cartItemsIdNumbersAndQuantities={[]}
            cartTotal={props.cartTotal}
            wrestlerUserId={selectedUserId}
            cart={props.cart}
          />
        </div>
      )}
    </div>
  );
};

export default CheckoutAdmin;

interface IProps {
  cancelCheckout: Function;
  cartTotal: number;
  cart: ICart[];
  handleShowAdminInsertServicesFunc: Function;
  payingCash: boolean;
  payingCard: boolean;
}
