import * as React from "react";
import { useState, useEffect } from "react";
import { IDateUnits, IServicesAndMerchandise } from "../interfacesForPayments";

const ItemCardAdmin = (props: IProps) => {
  let {
    id,
    name_of_item,
    cost_of_item,
    item_type_id,
    item_type_name,
    number_of_items_included,
    added_by_user_id,
    tenant_id,
    date_units_id_for_expiration,
    number_of_date_units_for_expiration,
    has_recurring_payment_contract,
    unit,
    is_active,
  } = props.serviceOrMerchandise;
  const [quantity, setQuantity] = useState<number>(1);
  const [addToCartButtonText, setAddToCartButtonText] =
    useState<string>("Add to cart");

  let addToCartClicked = () => {
    props.serviceOrMerchandise["quantity"] = quantity;
    let isInCart = props.addToOrRemoveFromCartArray(
      props.serviceOrMerchandise,
      true
    );
    if (isInCart) {
      setAddToCartButtonText("Remove from cart");
    } else {
      setAddToCartButtonText("Add to cart");
    }
  };

  let removeFromCartClicked = () => {
    let isInCart = props.addToOrRemoveFromCartArray(
      props.serviceOrMerchandise,
      false
    );
    if (!isInCart) {
      setAddToCartButtonText("Add to cart");
    } else {
      setAddToCartButtonText("Remove from cart");
    }
  };

  let handleCostOfItemChange = (e: any) => {
    let val = e.target.value;
    console.log(val);
    props.serviceOrMerchandise.cost_of_item = val;
    console.log(props.serviceOrMerchandise);
  };

  let handleDateUnitsIdChange = (e: any) => {
    let newDateUnitsId = e.target.value;
    console.log(date_units_id_for_expiration);
    for (let x = 0; x < props.dateUnits.length; x++) {
      const unit = props.dateUnits[x];
      if (newDateUnitsId == unit.id) {
        props.serviceOrMerchandise.unit = unit.unit;
        break;
      }
    }
    console.log(props.serviceOrMerchandise);
    props.serviceOrMerchandise.date_units_id_for_expiration = newDateUnitsId;
  };
  let handleNumberOfDateUnitsChange = (e: any) => {
    let val = e.target.value;
    props.serviceOrMerchandise.number_of_date_units_for_expiration = val;
    console.log(val);
    console.log(props.serviceOrMerchandise);
  };

  return (
    <div
      className="card m-2 p-0 col-md-9 col-12"
      style={{
        borderRadius: "1rem",
        borderColor: `${
          addToCartButtonText === "Add to cart" ? "lightgray" : "black"
        }`,
        backgroundColor: `${
          addToCartButtonText === "Add to cart" ? "white" : "#F0F0F0"
        }`,
      }}
    >
      <div className="card-body">
        <div className="mb-3">
          <h5 className="card-title mb-0">{name_of_item}</h5>
        </div>
        <h6 className="card-subtitle mb-2 text-muted">
          items included: {number_of_items_included}
        </h6>
        <div className="mb-2 d-flex flex-wrap">
          <p className="card-text col-12 p-0 m-0">
            ${" "}
            <input
              disabled={addToCartButtonText === "Remove from cart" && true}
              onChange={handleCostOfItemChange}
              style={{ width: "5rem" }}
              type="number"
              name="cost_of_item"
              id="cost_of_item"
              defaultValue={cost_of_item}
            />{" "}
          </p>

          {/* recurring payment start (this should never appear) */}
          {has_recurring_payment_contract && date_units_id_for_expiration && (
            <>
              {/* <p style={{ fontSize: ".6rem", backgroundColor: "yellow" }}>
                Billed every {number_of_date_units_for_expiration}{" "}
                {Number(number_of_date_units_for_expiration) > 1
                  ? unit
                  : unit?.slice(0, unit.length - 1)}
              </p> */}

              <div>
                <p
                  style={{
                    fontSize: ".6rem",
                    border: "solid black 1px",
                    borderRadius: ".3rem",
                    padding: ".1rem",
                    marginTop: ".1rem",
                  }}
                >
                  <span style={{ backgroundColor: "lightBlue" }}>
                    {" "}
                    Billed every:{" "}
                  </span>
                  <br />
                  <span>
                    {" "}
                    <input
                      onChange={handleNumberOfDateUnitsChange}
                      style={{ width: "3rem" }}
                      type="number"
                      defaultValue={
                        number_of_date_units_for_expiration
                          ? number_of_date_units_for_expiration
                          : undefined
                      }
                    />{" "}
                    <br />
                    {/* {number_of_date_units_for_expiration} */}{" "}
                    <select
                      defaultValue={date_units_id_for_expiration}
                      onChange={handleDateUnitsIdChange}
                      name="dateUnits"
                      id="dateUnits"
                    >
                      {props.dateUnits.map((unit) => {
                        return (
                          <option key={unit.id} value={unit.id}>
                            {" "}
                            {unit.unit}
                          </option>
                        );
                      })}
                    </select>
                    {/* {Number(number_of_date_units_for_expiration) > 1
                    ? unit
                    : unit?.slice(0, unit.length - 1)} */}
                  </span>
                </p>
              </div>
            </>
          )}
          {/* end recurring */}

          {!has_recurring_payment_contract && date_units_id_for_expiration && (
            <div>
              <p
                style={{
                  fontSize: ".6rem",
                  border: "solid black 1px",
                  borderRadius: ".3rem",
                  padding: ".1rem",
                  marginTop: ".1rem",
                }}
              >
                <span style={{ backgroundColor: "yellow" }}> Expires in: </span>
                <br />
                <span>
                  {" "}
                  <input
                    onChange={handleNumberOfDateUnitsChange}
                    style={{ width: "3rem" }}
                    type="number"
                    defaultValue={
                      number_of_date_units_for_expiration
                        ? number_of_date_units_for_expiration
                        : undefined
                    }
                  />{" "}
                  <br />
                  {/* {number_of_date_units_for_expiration} */}{" "}
                  <select
                    defaultValue={date_units_id_for_expiration}
                    onChange={handleDateUnitsIdChange}
                    name="dateUnits"
                    id="dateUnits"
                  >
                    {props.dateUnits.map((unit) => {
                      return (
                        <option key={unit.id} value={unit.id}>
                          {" "}
                          {unit.unit}
                        </option>
                      );
                    })}
                  </select>
                  {/* {Number(number_of_date_units_for_expiration) > 1
                    ? unit
                    : unit?.slice(0, unit.length - 1)} */}
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="d-flex align-item-center">
          <p className="card-text">Quantity:</p>
          <div className="ml-3 mr-3 d-flex">
            <div
              onClick={() =>
                addToCartButtonText === "Add to cart" &&
                !has_recurring_payment_contract
                  ? setQuantity(quantity > 1 ? quantity - 1 : quantity)
                  : null
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={
                  addToCartButtonText === "Add to cart" &&
                  !has_recurring_payment_contract
                    ? "#000000"
                    : "#D3D3D3"
                }
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <span className="mr-2 ml-2 text-center" style={{ width: "3rem" }}>
              {quantity}
            </span>
            <div
              onClick={() => {
                addToCartButtonText === "Add to cart" &&
                !has_recurring_payment_contract
                  ? setQuantity(quantity + 1)
                  : null;
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={
                  addToCartButtonText === "Add to cart" &&
                  !has_recurring_payment_contract
                    ? "#000000"
                    : "#D3D3D3"
                }
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
          </div>
        </div>
        <div className="d-flex">
          {/* <button className="btn btn-sm btn-warning mr-2">Buy now</button> */}
          <button
            onClick={
              addToCartButtonText === "Add to cart"
                ? addToCartClicked
                : removeFromCartClicked
            }
            className={`btn btn-sm btn-${
              addToCartButtonText === "Add to cart"
                ? "success"
                : "outline-danger"
            } ml-2`}
          >
            {addToCartButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCardAdmin;

interface IProps {
  serviceOrMerchandise: IServicesAndMerchandise;
  addToOrRemoveFromCartArray: Function;
  dateUnits: IDateUnits[];
  payingCash: boolean;
  payingCard: boolean;
}
