import * as React from "react";
import { useState, useEffect } from "react";
import CheckInForPracticesHistory from "./CheckInForPracticesHistory";
import NavigationBar from "../NavigationBar";
import * as date from "../services/dateAndTimeFunctions";
import Select from "react-select";

const CheckInForPractices = () => {
  const [userRole, setUserRole] = React.useState();
  const [allWrestlersInTenant, setAllWrestlersInTenant] = useState<any[]>();
  const [wrestlerId, setWrestlerId] = useState<number>();
  const [selectedWrestlerName, setSelectedWrestlerName] = useState<string>();
  const [tenantId, setTenantId] = useState<number>();
  const [lastCheckInStatusMessage, setLastCheckInStatusMessage] =
    useState<string>();
  const [lastCheckInStatus, setLastCheckInStatus] = useState<boolean>();
  const [boolForRender, setBoolForRender] = useState<boolean>(false);

  let UID = Number(localStorage.getItem("UID"));
  useEffect(() => {
    fetch(`/api/users/${UID}`)
      .then((res) => res.json())
      .then((results) => {
        setUserRole(results[0].role);
      });
  }, []);

  useEffect(() => {
    let isMounted = true;
    let token = localStorage.getItem("token");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch("/api/users/getAllUsersInTenantWithNames", requestOptions)
      .then((res) => res.json())
      .then((res) => isMounted && setAllWrestlersInTenant(res))
      .catch((err) => console.log(err));
    const requestOptions2 = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch("/api/tenants/getTenantNameAndUserRole", requestOptions2)
      .then((res) => res.json())
      .then((res) => isMounted && setTenantId(res.tokenVerify.tenant))
      .catch((er) => console.log(er));
    return () => {
      isMounted = false;
    };
  }, []);

  let handleWrestlerClicked = (e: {
    id: number;
    first_name: string;
    last_name: string;
  }) => {
    console.log(e);
    let fullname = e.first_name + " " + e.last_name;
    setWrestlerId(e.id);
    setSelectedWrestlerName(fullname);
    // setSearchForWrestlerInput("");
  };

  let handleCheckInForPractice = () => {
    if (!wrestlerId) {
      alert("select a wrestler");
      return;
    }
    if (!confirm("Are you sure you want to check this wrestler in?")) return;
    let token = localStorage.getItem("token");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        wrestlerId,
        todaysDate: date.createMomentCurrentDateTime(),
        startOfDay: date.createMomentDateStartOfDayFromDateOnly(),
        endOfDay: date.createMomentDateEndOfDayFromDateOnly(),
      }),
    };
    // console.log(requestOptions);
    fetch("/api/transactions/checkInWrestlerForPractice", requestOptions)
      .then((res) => res.json())
      .then(
        (res: {
          checkInSuccessful: boolean;
          message: string;
          requiresSecondConfirm: boolean | undefined;
        }) => {
          if (res.requiresSecondConfirm == true) {
            if (!confirm(res.message)) return;
            const requestOptions2 = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                wrestlerId,
                confirmSameDayCheckIn: true,
                todaysDate: date.createMomentCurrentDateTime(),
                startOfDay: date.createMomentDateStartOfDayFromDateOnly(),
                endOfDay: date.createMomentDateEndOfDayFromDateOnly(),
              }),
            };
            // console.log(requestOptions2);
            fetch(
              "/api/transactions/checkInWrestlerForPractice",
              requestOptions2
            )
              .then((res) => res.json())
              .then(
                (res: {
                  checkInSuccessful: boolean;
                  message: string;
                  // requiresSecondConfirm: boolean | undefined;
                }) => {
                  setLastCheckInStatus(res.checkInSuccessful);
                  setLastCheckInStatusMessage(res.message);
                  setBoolForRender(!boolForRender);
                }
              )
              .catch((err2) => console.log(err2));
          } else {
            setLastCheckInStatus(res.checkInSuccessful);
            setLastCheckInStatusMessage(res.message);
            setBoolForRender(!boolForRender);
          }
        }
      )
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <NavigationBar />
      {userRole && (userRole === "admin" || userRole === "coach") ? (
        <div>
          <div className="d-flex justify-content-center flex-wrap">
            <h1 className="col-12 text-center">Check-ins for practice</h1>

            <div className="col-md-5 col-10">
              <Select
                // defaultValue={selectedUserId}
                options={allWrestlersInTenant}
                getOptionLabel={(option) => {
                  return `${option.first_name ? option.first_name : "N/A"} ${
                    option.last_name ? option.last_name : ""
                  }`;
                }}
                getOptionValue={(option) => {
                  return `${option.id}`;
                }}
                onChange={handleWrestlerClicked}
              />
            </div>
            <div className="col-12 text-center m-2">
              <button
                onClick={handleCheckInForPractice}
                className="btn btn-success"
              >
                Check-in
                <br /> {selectedWrestlerName}
              </button>
            </div>
            {lastCheckInStatus !== undefined && lastCheckInStatusMessage && (
              <div className="col-12 text-center m-2">
                <span
                  style={{
                    color: `${lastCheckInStatus === true ? "green" : "red"}`,
                  }}
                >
                  {lastCheckInStatusMessage}
                </span>
              </div>
            )}
          </div>
          <hr />
          {tenantId && (
            <CheckInForPracticesHistory
              tenantId={tenantId}
              boolForRenderFromParent={boolForRender}
            />
          )}
        </div>
      ) : (
        <div>
          <h3>Nothing here...</h3>
        </div>
      )}
    </div>
  );
};

export default CheckInForPractices;
