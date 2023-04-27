import * as React from "react";
import { useState, useEffect } from "react";
import ViewPaymentsAndRefundsForWrestlerV2 from "./JasonAttemptsV2/ViewPaymentsAndRefundsForWrestlerV2";
import ViewAllPaymentsAndRefunds from "./ViewAllPaymentsAndRefunds";
// import ViewPaymentsAndRefundsForWrestler from "./ViewPaymentsAndRefundsForWrestler";

const ViewPaymentsAndRefunds = (props: IProps) => {
  const [showAllPaymentsAndRefunds, setShowAllPaymentsAndRefunds] =
    useState<boolean>(false);
  const [
    showPaymentsAndRefundsForWrestler,
    setShowPaymentsAndRefundsForWrestler,
  ] = useState<boolean>(false);

  let handleViewAllPaymentsAndRefunds = () => {
    setShowAllPaymentsAndRefunds(!showAllPaymentsAndRefunds);
    setShowPaymentsAndRefundsForWrestler(false);
  };

  let handleViewPaymentsAndRefundsForWrestler = () => {
    setShowPaymentsAndRefundsForWrestler(!showPaymentsAndRefundsForWrestler);
    setShowAllPaymentsAndRefunds(false);
  };

  return (
    <div>
      <div>
        <button
          onClick={handleViewAllPaymentsAndRefunds}
          className={`m-2 btn btn-sm btn-${
            showAllPaymentsAndRefunds ? "dark" : "outline-dark"
          }`}
        >
          All
        </button>
        <button
          onClick={handleViewPaymentsAndRefundsForWrestler}
          className={`m-2 btn btn-sm btn-${
            showPaymentsAndRefundsForWrestler ? "dark" : "outline-dark"
          }`}
        >
          Wrestlers
        </button>
      </div>
      <div>
        {showAllPaymentsAndRefunds && <ViewAllPaymentsAndRefunds />}
        {showPaymentsAndRefundsForWrestler && (
          <ViewPaymentsAndRefundsForWrestlerV2 />
        )}
      </div>
    </div>
  );
};

export default ViewPaymentsAndRefunds;
interface IProps {}
