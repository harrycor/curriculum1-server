// remove this file it will not be used 

import * as React from "react";
import { useState, useEffect } from "react";

const AddPricesAndProductForSubscription = () => {
  const [productName, setProductName] = useState<string>();
  const [productPrice, setProductPrice] = useState<number>();
  const [recurringInterval, setRecurringInterval] = useState<string>();

  let handleCreateSubscription = () => {
    let token = localStorage.getItem("token");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productName,
        productPrice,
        recurringInterval,
      }),
    };
    fetch(`/api/stripeAccounts/createStripeProduct`, requestOptions)
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  let handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value);
  };
  let handleProductPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductPrice(Number(e.target.value));
  };
  let handleRecurringInterval = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRecurringInterval(e.target.value);
  };

  return (
    <div>
      <div>
        <input onChange={handleProductNameChange} type="text" />
      </div>
      <div>
        <input type="number" onChange={handleProductPriceChange} />
      </div>
      <div>
        <select onChange={handleRecurringInterval}>
          <option value=""></option>
          <option value="day">day</option>
          <option value="week">week</option>
          <option value="month">month</option>
          <option value="year">year</option>
        </select>
      </div>
      <div>
        <button
          onClick={handleCreateSubscription}
          className="btn btn-sm btn-success"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

// export default AddPricesAndProductForSubscription;
