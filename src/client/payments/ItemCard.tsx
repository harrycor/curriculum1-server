import * as React from "react";
import { useState } from "react";
import { IServicesAndMerchandise } from "./interfacesForPayments";

const ItemCard = (props: IProps) => {
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
  } = props.serviceOrMerch;
  const [quantity, setQuantity] = useState<number>(1);
  const [addToCartButtonText, setAddToCartButtonText] =
    useState<string>("Add to cart");

  let addToCartClicked = () => {
    props.serviceOrMerch["quantity"] = quantity;
    let isInCart = props.addToOrRemoveFromCartArray(props.serviceOrMerch, true);
    if (isInCart) {
      setAddToCartButtonText("Remove from cart");
    } else {
      setAddToCartButtonText("Add to cart");
    }
  };

  let removeFromCartClicked = () => {
    let isInCart = props.addToOrRemoveFromCartArray(
      props.serviceOrMerch,
      false
    );
    if (!isInCart) {
      setAddToCartButtonText("Add to cart");
    } else {
      setAddToCartButtonText("Remove from cart");
    }
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
          <p className="card-text col-12 p-0 m-0">${cost_of_item} </p>
          {has_recurring_payment_contract && (
            <>
              <p style={{ fontSize: ".6rem", backgroundColor: "yellow" }}>
                Billed every {number_of_date_units_for_expiration}{" "}
                {Number(number_of_date_units_for_expiration) > 1
                  ? unit
                  : unit?.slice(0, unit.length - 1)}
              </p>
            </>
          )}
          {!has_recurring_payment_contract && date_units_id_for_expiration && (
            <>
              <p style={{ fontSize: ".6rem", backgroundColor: "yellow" }}>
                Expires in {number_of_date_units_for_expiration}{" "}
                {Number(number_of_date_units_for_expiration) > 1
                  ? unit
                  : unit?.slice(0, unit.length - 1)}
              </p>
            </>
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

export default ItemCard;
interface IProps {
  serviceOrMerch: IServicesAndMerchandise;
  addToOrRemoveFromCartArray: Function;
}
