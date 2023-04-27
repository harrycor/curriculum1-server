import * as React from "react";
import { useState, useEffect } from "react";
import NavigationBar from "../NavigationBar";
import ServicesAndMerchandiseCredentialCheck from "./ServicesAndMerchandiseCredentialCheck";
import AddItemTypes from "./AddItemTypes";
import AdminInsertServiceOrMerchandise from ".//adminServicesAndMerchandise/AdminInsertServiceOrMerchandise";

const ServicesAndMerchandiseStart = () => {
  const [role, setRole] = useState<string>();
  const [tenantName, setTenantName] = useState<string>();
  const [showItemTypes, setShowItemTypes] = useState<boolean>(false);
  // const [showAdminInsertServices, setShowAdminInsertServices] =
  //   useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>();
  const [
    processingRecurringPaymentContractsStatuses,
    setProcessingRecurringPaymentContractsStatuses,
  ] = useState<boolean>(false);
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
    fetch("/api/tenants/getTenantNameAndUserRole", requestOptions)
      .then((res) => res.json())
      .then((res) => {
        if (isMounted) {
          setRole(res.tokenVerify.role);
          setTenantName(res.tenantName);
          setUserEmail(res.tokenVerify.email);
        }
      })
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, []);

  let handleCheckRecurringBilling = () => {
    if (
      !confirm(
        "Are you sure you want to check for recurring billing? This may take a minute."
      )
    )
      return;
    const requestOptions2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    setProcessingRecurringPaymentContractsStatuses(true);
    fetch(
      "/api/automatedServices/checkRecurringPaymentContractsStatus",
      requestOptions2
    )
      .then((res) => res.json())
      .then((res) => {
        alert(res.message);
        setProcessingRecurringPaymentContractsStatuses(false);
      })
      .catch((err) => {
        console.log(err);
        setProcessingRecurringPaymentContractsStatuses(false);
      });
  };

  // let handleShowAdminInsertServices = () => {
  //   setShowAdminInsertServices(!showAdminInsertServices);
  // };

  return (
    <div>
      <>
        <NavigationBar />
      </>
      {role === "admin" &&
        tenantName === "dynamic" &&
        userEmail === "jaytonbye@yahoo.com" && (
          <div className="d-flex justify-content-center mt-3 flex-wrap">
            {/* {!showAdminInsertServices && ( */}
              <>
                <button
                  onClick={() => setShowItemTypes(!showItemTypes)}
                  className={`btn btn-${showItemTypes ? "dark" : "warning"}`}
                >
                  {showItemTypes ? "Back to store" : "Item Types"}
                </button>{" "}
                <div className="col-12 text-center">
                  <button
                    disabled={processingRecurringPaymentContractsStatuses}
                    onClick={handleCheckRecurringBilling}
                    className="btn btn-danger"
                  >
                    Check recurring billing
                  </button>
                </div>
              </>
            {/* )} */}
          </div>
        )}

      {/* {!showAdminInsertServices && ( */}
      <>
        {!showItemTypes ? (
          <div>
            <ServicesAndMerchandiseCredentialCheck />
          </div>
        ) : (
          <div>
            <AddItemTypes />
          </div>
        )}
      </>
      {/* // )} */}
      {/* <>
        {showAdminInsertServices && (
          <div>
            <AdminInsertServiceOrMerchandise
              handleShowAdminInsertServicesFunc={handleShowAdminInsertServices}
            />
          </div>
        )}
      </> */}
    </div>
  );
};
export default ServicesAndMerchandiseStart;
