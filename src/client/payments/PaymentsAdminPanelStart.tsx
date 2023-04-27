import * as React from "react";
import { useState, useEffect } from "react";
import PayoutPercentages from "./PayoutPercentages";
import WrestlerCheckInHistoryStart from "../account/manageAndViewAccountDetails/checkInHistory/WrestlerCheckInHistoryStart";
import CoachsCheckInHistoryAndEarningsStart from "./CoachsCheckInHistoryAndEarningsStart";
// import ClubProgressStart from "./ClubProgressStart";

const PaymentsAdminPanelStart = () => {
  const [showPayoutPercentages, setShowPayoutPercentages] = useState(false);
  const [showCheckInHistory, setShowCheckInHistory] = useState(false);
  const [showAllCoachsEarning, setShowAllCoachsEarning] = useState(false);
  const [showClubProgress, setShowClubProgress] = useState(false);

  let showOrHideClubProgress = () => {
    setShowClubProgress(!showClubProgress);
    setShowPayoutPercentages(false);
    setShowCheckInHistory(false);
    setShowAllCoachsEarning(false);
  };
  let showOrHidePayoutPercentages = () => {
    setShowPayoutPercentages(!showPayoutPercentages);
    setShowCheckInHistory(false);
    setShowAllCoachsEarning(false);
    setShowClubProgress(false);
  };
  let showOrHideCheckInHistory = () => {
    setShowCheckInHistory(!showCheckInHistory);
    setShowPayoutPercentages(false);
    setShowAllCoachsEarning(false);
    setShowClubProgress(false);
  };
  let showOrHideAllCoachsEarning = () => {
    setShowAllCoachsEarning(!showAllCoachsEarning);
    setShowPayoutPercentages(false);
    setShowCheckInHistory(false);
    setShowClubProgress(false);
  };

  return (
    <div className="mt-4" style={{ marginBottom: "15rem" }}>
      <div>
        <div className="d-flex justify-content-center">
          <h2>
            <u>Store admin</u>
          </h2>
        </div>
        <div className="d-flex justify-content-around align-items-center m-2 flex-wrap">
          {/* <button
            onClick={showOrHideClubProgress}
            className={`btn btn-sm btn-${
              showClubProgress ? "dark" : "outline-dark"
            } m-2`}
          >
            Club progress
          </button> */}
          <button
            onClick={showOrHidePayoutPercentages}
            className={`btn btn-sm btn-${
              showPayoutPercentages ? "dark" : "outline-dark"
            } m-2`}
          >
            Payout percentages
          </button>
          <button
            onClick={showOrHideCheckInHistory}
            className={`btn btn-sm btn-${
              showCheckInHistory ? "dark" : "outline-dark"
            } m-2`}
          >
            Wrestlers check-in history
          </button>
          <button
            onClick={showOrHideAllCoachsEarning}
            className={`btn btn-sm btn-${
              showAllCoachsEarning ? "dark" : "outline-dark"
            } m-2`}
          >
            Coachs check-in history and earnings
          </button>
        </div>
        {/* {showClubProgress && (
          <div>
            <ClubProgressStart />
          </div>
        )} */}
        {showPayoutPercentages && (
          <div>
            <PayoutPercentages />
          </div>
        )}
        {showCheckInHistory && (
          <div>
            <WrestlerCheckInHistoryStart />
          </div>
        )}
        {showAllCoachsEarning && (
          <div>
            <CoachsCheckInHistoryAndEarningsStart />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsAdminPanelStart;
