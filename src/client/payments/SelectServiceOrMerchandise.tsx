import * as React from "react";
import { useState, useEffect } from "react";
import { IServicesAndMerchandise } from "./interfacesForPayments";
import ItemCard from "./ItemCard";
import ReviewOrderForServicesAndMerchandise from "./ReviewOrderForServicesAndMerchandise";
import { ICart } from "./interfacesForPayments";

const SelectServiceOrMerchandise = () => {
  const [allServicesAndMerchandise, setAllServicesAndMerchandise] =
    useState<IServicesAndMerchandise[]>();
  const [cart, setCart] = useState<ICart[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [tenantName, setTenantName] = useState<string>();
  const [reviewYourOrder, setReviewYourOrder] = useState<boolean>(false);
  let token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;
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
    return <div>Theres nothing here :(</div>;
  } else {
    return (
      <>
        <div style={{ display: `${reviewYourOrder ? "none" : "block"}` }}>
          <div className="mb-5">
            <div className="d-flex text-center justify-content-center ">
              <span style={{ fontSize: "2rem" }}>
                Browse {tenantName}'s store!
              </span>
            </div>
            <div>
              {allServicesAndMerchandise.map((serviceOrMerch) => {
                return (
                  <div
                    className="d-flex justify-content-center flex-wrap p-1"
                    key={serviceOrMerch.id}
                  >
                    <ItemCard
                      serviceOrMerch={serviceOrMerch}
                      addToOrRemoveFromCartArray={addToOrRemoveFromCartArray}
                    />
                  </div>
                );
              })}
            </div>
          </div>
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
          <ReviewOrderForServicesAndMerchandise
            cancelCheckout={cancelCheckout}
            cart={cart}
          />
        )}
      </>
    );
  }
};

export default SelectServiceOrMerchandise;

// export interface ICart extends IServicesAndMerchandise {
//   quantity: number;
// }
