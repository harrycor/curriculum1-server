import React, { useState, useEffect } from "react";

const CancelRecurringPaymentContract = (props: IProps) => {
  let token = localStorage.getItem("token");

  let handleCancelContract = () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        recurringPaymentContractId: props.contractId,
      }),
    };
    fetch(
      "/api/recurringPaymentContracts/setRecurringPaymentContractToNotActive",
      requestOptions
    )
      .then((res) => res.json())
      .then((res) => {
        alert(res.message);
        props.renderFunc();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div>
        <button
          onClick={handleCancelContract}
          style={{ fontSize: ".7rem" }}
          className="btn btn-sm btn-danger"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CancelRecurringPaymentContract;

interface IProps {
  contractId: number;
  renderFunc: Function;
}
