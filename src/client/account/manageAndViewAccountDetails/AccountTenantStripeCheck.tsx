import * as React from "react";
import { useState, useEffect } from "react";
import CheckInHistoryForUser from "./checkInHistory/CheckInHistoryForUser";
import PurchasesForUser from "./purchaseHistory/PurchasesForUser";
import CoachCheckInHistoryAndEarnings from "../../payments/CoachCheckInHistoryAndEarnings";
import ManageRecurringPaymentContracts from "./recurringPaymentContracts/ManageRecurringPaymentContracts";

const AccountTenantStripeCheck = (props: IProps) => {
  const [isStripeAccountActive, setIsStripeAccountActive] = useState<boolean>();
  const [showCheckInHistory, setShowCheckInHistory] = useState<boolean>(false);
  const [showPurchaseHistory, setShowPurchaseHistory] =
    useState<boolean>(false);
  const [
    showErningsAndCheckinHistoryForCoach,
    setShowErningsAndCheckinHistoryForCoach,
  ] = useState<boolean>(false);
  const [
    showActiveRecurringPaymentContracts,
    setShowActiveRecurringPaymentContracts,
  ] = useState<boolean>(false);
  let token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/stripeAccounts/getStripeAccountStatusForAccount`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res: { isStripeAccountActive: boolean }) => {
        isMounted && setIsStripeAccountActive(res.isStripeAccountActive);
      })
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, []);

  let handleShowCheckInHistoryClicked = () => {
    setShowCheckInHistory(!showCheckInHistory);
    setShowPurchaseHistory(false);
    setShowErningsAndCheckinHistoryForCoach(false);
    setShowActiveRecurringPaymentContracts(false);
  };

  let handleShowPurchaseHistoryClicked = () => {
    setShowPurchaseHistory(!showPurchaseHistory);
    setShowCheckInHistory(false);
    setShowErningsAndCheckinHistoryForCoach(false);
    setShowActiveRecurringPaymentContracts(false);
  };

  let handleShowCoachsEarning = () => {
    setShowErningsAndCheckinHistoryForCoach(
      !showErningsAndCheckinHistoryForCoach
    );
    setShowPurchaseHistory(false);
    setShowCheckInHistory(false);
    setShowActiveRecurringPaymentContracts(false);
  };

  let handleShowActiveRecurringPaymentContracts = () => {
    setShowActiveRecurringPaymentContracts(
      !showActiveRecurringPaymentContracts
    );
    setShowPurchaseHistory(false);
    setShowCheckInHistory(false);
    setShowErningsAndCheckinHistoryForCoach(false);
  };

  return (
    <div>
      <div>
        {isStripeAccountActive !== undefined ? (
          <>
            {isStripeAccountActive && props.userId && (
              <div>
                <div className="d-flex justify-content-center flex-wrap">
                  {(props.userRole === "admin" ||
                    props.userRole === "coach") && (
                    <button
                      onClick={handleShowCoachsEarning}
                      className={`ml-3 mr-3 mt-5 mb-3 btn btn-sm btn-${
                        showErningsAndCheckinHistoryForCoach
                          ? "dark"
                          : "outline-dark"
                      }`}
                    >
                      Earnings and check-in history
                    </button>
                  )}
                  <button
                    onClick={handleShowPurchaseHistoryClicked}
                    className={`ml-3 mr-3 mt-5 mb-3 btn btn-sm btn-${
                      showPurchaseHistory ? "dark" : "outline-dark"
                    }`}
                  >
                    Purchase history
                  </button>
                  <button
                    onClick={handleShowCheckInHistoryClicked}
                    className={`ml-3 mr-3 mt-5 mb-3 btn btn-sm btn-${
                      showCheckInHistory ? "dark" : "outline-dark"
                    }`}
                  >
                    Check-in history
                  </button>
                  <button
                    onClick={handleShowActiveRecurringPaymentContracts}
                    className={`ml-3 mr-3 mt-5 mb-3 btn btn-sm btn-${
                      showActiveRecurringPaymentContracts
                        ? "dark"
                        : "outline-dark"
                    }`}
                  >
                    Manage subscriptions
                  </button>
                </div>
                {showPurchaseHistory && (
                  <div style={{ marginTop: "1rem", marginBottom: "3rem" }}>
                    <PurchasesForUser userId={props.userId} />
                  </div>
                )}
                <div>
                  {showCheckInHistory && (
                    <>
                      <CheckInHistoryForUser userId={props.userId} />
                    </>
                  )}
                </div>
                <div>
                  {showErningsAndCheckinHistoryForCoach && (
                    <>
                      <CoachCheckInHistoryAndEarnings userId={props.userId} />
                    </>
                  )}
                </div>
                <div>
                  {showActiveRecurringPaymentContracts && (
                    <>
                      <ManageRecurringPaymentContracts
                        userId={props.userId}
                        admin={false}
                      />
                    </>
                  )}
                </div>
              </div>
            )}
            {!isStripeAccountActive && (
              <div>your team does not have a store account setup</div>
            )}
          </>
        ) : (
          <div className="d-flex justify-content-center mt-5 flex-wrap">
            <span className="col-12 text-center" style={{ fontSize: "2.5rem" }}>
              Loading store status, one moment please...
            </span>
            <div
              style={{
                border: "10px solid #f3f3f3",
                borderTop: "7px solid #3498db",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                animation: "spin 1s linear infinite",
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountTenantStripeCheck;

interface IProps {
  userId: number;
  userRole: string;
}
