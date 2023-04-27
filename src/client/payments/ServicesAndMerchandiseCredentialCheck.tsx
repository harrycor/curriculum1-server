import * as React from "react";
import { useState, useEffect } from "react";
import AddServicesAndMerchandise from "./AddServicesAndMerchandise";
import AdminInsertServiceOrMerchandise from "./adminServicesAndMerchandise/AdminInsertServiceOrMerchandise";
import SelectServiceOrMerchandise from "./SelectServiceOrMerchandise";

const ServicesAndMerchandiseCredentialCheck = () => {
  const [role, setRole] = useState<string>();
  const [tenantHasStripeAccount, setTenantHasStripeAccount] =
    useState<boolean>();
  const [detailsSubmitted, setDetailsSubmitted] = useState<boolean>();
  const [cardPaymentsAndTransfersActive, setCardPaymentsAndTransfersActive] =
    useState<boolean>();
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [stripeAccountType, setStripeAccountType] = useState<string>();
  const [showAddServicesAndMerchandise, setShowAddServicesAndMerchandise] =
    useState<boolean>(false);
  const [showAdminInsertServices, setShowAdminInsertServices] =
    useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    let token = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (token) {
      fetch("/api/stripeAccounts/getStoreAvailability", requestOptions)
        .then((res) => res.json())
        .then((res: IStoreAvailabilityInfo) => {
          if (isMounted) {
            setRole(res.tokenVerify.role);
            setStripeAccountType(res.stripeAccountType);
            setTenantHasStripeAccount(
              res.tenantHasStripeAccount ? res.tenantHasStripeAccount : false
            );
            setDetailsSubmitted(
              res.detailsSubmitted ? res.detailsSubmitted : false
            );
            setCardPaymentsAndTransfersActive(
              res.cardPaymentsAndTranfersActive
                ? res.cardPaymentsAndTranfersActive
                : false
            );
          }
        })
        .catch((err) => console.log(err));
    }
    return () => {
      isMounted = false;
    };
  }, []);

  let adminInsertCompletionRedirect = () => {
    console.log("hits");
    setShowAdminInsertServices(false);
    setShowAdminInsertServices(true);
  };

  let showOrHideAddServicesAndMerchandiseFunc = () => {
    setShowAdminInsertServices(false);
    setShowAddServicesAndMerchandise(!showAddServicesAndMerchandise);
  };

  let handleShowAdminInsertServices = () => {
    setShowAddServicesAndMerchandise(false);
    setShowAdminInsertServices(!showAdminInsertServices);
  };

  let createStripeAccount = () => {
    setDisableButton(true);
    let token = localStorage.getItem("token");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch("/api/stripeAccounts/createStripeAccount", requestOptions)
      .then((res) => res.json())
      .then((res) => (window.location.href = res));
  };

  let finishSettingUpStripeAccount = () => {
    setDisableButton(true);
    let token = localStorage.getItem("token");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch("api/stripeAccounts/completeOrUpdateAccountDetails", requestOptions)
      .then((res) => res.json())
      .then((res) => (window.location.href = res));
  };

  if (role && detailsSubmitted !== undefined) {
    return (
      <div>
        {/* admin only */}
        {role === "admin" &&
          (tenantHasStripeAccount ? (
            detailsSubmitted ? (
              <>
                {cardPaymentsAndTransfersActive ? (
                  // Store is good to go
                  <>
                    <div className="col-12 d-flex justify-content-center m-1">
                      <button
                        onClick={handleShowAdminInsertServices}
                        className="btn btn-sm btn-info"
                      >
                        {showAdminInsertServices
                          ? "Back"
                          : "Cash/Credit purchases"}
                      </button>
                    </div>
                    {!showAdminInsertServices && (
                      <div className="m-3 d-flex justify-content-center flex-wrap">
                        <div className="col-12 p-0 text-center m-2">
                          <a
                            style={{
                              backgroundColor: "#635bff",
                              color: "white",
                            }}
                            className="btn"
                            target={"_blank"}
                            href={`https://connect.stripe.com/app/express/${stripeAccountType}`}
                          >
                            Your Stripe account
                          </a>
                        </div>
                        <button
                          onClick={showOrHideAddServicesAndMerchandiseFunc}
                          className="btn btn-dark"
                        >
                          {showAddServicesAndMerchandise
                            ? `Back to store`
                            : `Add services or merchandise`}
                        </button>
                      </div>
                    )}
                    {showAddServicesAndMerchandise &&
                      !showAdminInsertServices && (
                        <div>
                          <AddServicesAndMerchandise />
                        </div>
                      )}
                    <>
                      {showAdminInsertServices && (
                        <div>
                          <AdminInsertServiceOrMerchandise
                            handleShowAdminInsertServicesFunc={
                              adminInsertCompletionRedirect
                            }
                          />
                        </div>
                      )}
                    </>
                  </>
                ) : (
                  <div className="d-flex flex-wrap justify-content-center">
                    <span
                      className="col-12 text-center"
                      style={{ fontSize: "2rem" }}
                    >
                      Almost there!
                    </span>
                    <span className="col-sm-7 col-11 text-center">
                      Your Stripe account has been created. However, Stripe is
                      still verifying your account. Please allow some time
                      before you are verified. (If you have already done this,
                      please allow some time for the request to be validated)
                    </span>
                    <div className="col-12 d-flex justify-content-center">
                      <a
                        style={{ backgroundColor: "#635bff", color: "white" }}
                        className="btn"
                        target={"_blank"}
                        href={`https://connect.stripe.com/app/express/${stripeAccountType}`}
                      >
                        Your Stripe account
                      </a>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="d-flex justify-content-center flex-wrap mt-5">
                <span
                  style={{
                    fontSize: "2rem",
                    paddingLeft: "3rem",
                    paddingRight: "3rem",
                  }}
                  className="col-12 text-center"
                >
                  Looks like information is needed to complete the payout
                  process. Finish setting up your store here:
                </span>
                <button
                  onClick={finishSettingUpStripeAccount}
                  disabled={disableButton}
                  className="btn btn-lg btn-danger"
                >
                  Complete setting up your account
                </button>
              </div>
            )
          ) : (
            <>
              <div className="d-flex justify-content-center m-3">
                <button
                  onClick={createStripeAccount}
                  disabled={disableButton}
                  className="btn btn-lg btn-success"
                >
                  Set up your store!
                </button>
              </div>
            </>
          ))}
        {/* end admin */}

        {tenantHasStripeAccount &&
        detailsSubmitted &&
        cardPaymentsAndTransfersActive ? (
          !showAddServicesAndMerchandise && (
            <div>
              {!showAdminInsertServices && <SelectServiceOrMerchandise />}
            </div>
          )
        ) : (
          <div className="d-flex justify-content-center">
            <span style={{ fontSize: "2rem" }}>
              it looks like the store is not in store! :(
            </span>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="d-flex justify-content-center mt-5 flex-wrap">
        <span className="col-12 text-center" style={{ fontSize: "2.5rem" }}>
          Loading, one moment please...
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
    );
  }
};

export default ServicesAndMerchandiseCredentialCheck;

interface IStoreAvailabilityInfo {
  tokenVerify: { userId: number; email: string; role: string; tenant: number };
  tenantHasStripeAccount?: boolean;
  detailsSubmitted?: boolean;
  cardPaymentsAndTranfersActive?: boolean;
  stripeAccountType?: string;
}
