import * as React from "react";
import { useState, useEffect } from "react";
import { IDateUnits, IServicesAndMerchandise } from "../interfacesForPayments";
import { ICart } from "../interfacesForPayments";
import CheckoutAdmin from "./CheckoutAdmin";
import ItemCardAdmin from "./ItemCardAdmin";

const SelectServicesAdmin = (props: IProps) => {
  const [payingCash, setPayingCash] = useState<boolean>(true);
  const [payingCard, setPayingCard] = useState<boolean>(false);
  const [allServicesAndMerchandise, setAllServicesAndMerchandise] =
    useState<IServicesAndMerchandise[]>();
  const [cart, setCart] = useState<ICart[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [tenantName, setTenantName] = useState<string>();
  const [allDateUnits, setAllDateUnits] = useState<IDateUnits[]>();
  const [reviewYourOrder, setReviewYourOrder] = useState<boolean>(false);
  let token = localStorage.getItem("token");

  useEffect(() => {
    console.log("hits");
    let isMounted = true;
    isMounted && setAllServicesAndMerchandise(undefined);
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(
      `/api/servicesAndMerchandise/getAllServicesAndMerchandiseByTenantId`,
      requestOptions
    )
      .then((res) => res.json())
      .then((res: IServicesAndMerchandise[] | any) => {
        if (isMounted) {
          setTenantName(res[1][0].tenant_name);
          setAllServicesAndMerchandise(res[0]);
        }
      })
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, [payingCash, payingCard]);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/dateUnits/getAllDateUnits")
      .then((res) => res.json())
      .then((res) => setAllDateUnits(res))
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    let newTotal: number = 0;
    cart.map(
      (item) => (newTotal = newTotal + item.cost_of_item * item.quantity)
    );
    isMounted && setCartTotal(newTotal);
    return () => {
      isMounted = false;
    };
  }, [cart]);

  let handlePayingCash = () => {
    emptyCart();
    setPayingCash(!payingCash);
    setPayingCard(false);
  };
  let handlePayingCard = () => {
    emptyCart();
    setPayingCard(!payingCard);
    setPayingCash(false);
  };

  let addToOrRemoveFromCartArray = (
    serviceOrMerch: ICart | IServicesAndMerchandise | any,
    addToCart: boolean
  ) => {
    if (addToCart) {
      setCart([...cart, serviceOrMerch]);
      return true;
    } else {
      setCart(
        cart.filter((cartItem) => {
          return cartItem.id !== serviceOrMerch.id;
        })
      );
      return false;
    }
  };

  let emptyCart = () => setCart([]);

  let checkoutClicked = () => {
    if (cart.length > 0) {
      setReviewYourOrder(true);
    } else {
      alert("There are no items in your cart!");
    }
  };
  let cancelCheckout = () => {
    setReviewYourOrder(false);
  };

  if (!allServicesAndMerchandise || allServicesAndMerchandise.length === 0) {
    return <div>Theres nothing here weird... :(</div>;
  }

  return (
    <div>
      <div style={{ display: `${reviewYourOrder ? "none" : "block"}` }}>
        <div className="text-center">
          <h3>Admin browse</h3>
          <div>
            <button
              onClick={handlePayingCash}
              className={`btn btn-sm btn-${
                payingCash ? "dark" : "outline-dark"
              } m-3`}
            >
              cash
            </button>
            <button
              onClick={handlePayingCard}
              className={`btn btn-sm btn-${
                payingCard ? "dark" : "outline-dark"
              } m-3`}
            >
              card
            </button>
          </div>
        </div>
        {allServicesAndMerchandise && allDateUnits && payingCash && (
          <div>
            {allServicesAndMerchandise.map((service) => {
              if (service.has_recurring_payment_contract) return;
              return (
                <div
                  key={service.id}
                  className="d-flex justify-content-center flex-wrap p-1"
                >
                  <ItemCardAdmin
                    serviceOrMerchandise={service}
                    addToOrRemoveFromCartArray={addToOrRemoveFromCartArray}
                    dateUnits={allDateUnits}
                    payingCash={true}
                    payingCard={false}
                  />
                </div>
              );
            })}
          </div>
        )}
        {allServicesAndMerchandise && allDateUnits && payingCard && (
          <div>
            {allServicesAndMerchandise.map((service) => {
              return (
                <div
                  key={service.id}
                  className="d-flex justify-content-center flex-wrap p-1"
                >
                  <ItemCardAdmin
                    serviceOrMerchandise={service}
                    addToOrRemoveFromCartArray={addToOrRemoveFromCartArray}
                    dateUnits={allDateUnits}
                    payingCash={false}
                    payingCard={true}
                  />
                </div>
              );
            })}
          </div>
        )}
        <div
          className="p-2"
          style={{ position: "sticky", bottom: 1, width: "100%" }}
        >
          <button
            onClick={checkoutClicked}
            className="btn btn-dark w-100"
            disabled={cart.length > 0 ? false : true}
          >
            <span className="mr-2">
              {cart.length > 0 && `(${cart.length})`}Checkout
            </span>
            <span className="ml-2">{cart.length > 0 && `$${cartTotal}`}</span>
          </button>
        </div>
      </div>
      {reviewYourOrder && (
        <CheckoutAdmin
          cancelCheckout={cancelCheckout}
          cart={cart}
          cartTotal={cartTotal}
          handleShowAdminInsertServicesFunc={
            props.handleShowAdminInsertServicesFunc
          }
          payingCash={payingCash}
          payingCard={payingCard}
        />
      )}
    </div>
  );
};

export default SelectServicesAdmin;

interface IProps {
  handleShowAdminInsertServicesFunc: Function;
}
