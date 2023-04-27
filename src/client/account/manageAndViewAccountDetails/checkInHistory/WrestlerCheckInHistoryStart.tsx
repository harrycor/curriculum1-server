import * as React from "react";
import { useState, useEffect } from "react";
import { IUsersForTenant } from "../../../payments/interfacesForPayments";
import PrivateLessonCheckInHistoryForUser from "./PrivateLessonCheckInHistoryForUser";
// import CheckInAndStatusOfWrestler from "./CheckInAndStatusOfWrestler";
// this is for the coach/ admin
const WrestlerCheckInHistoryStart = () => {
  const [allUsersInTenant, setAllUsersInTenant] = useState<IUsersForTenant[]>();
  const [showUserId, setShowUserId] = useState<number>(0);
  const [showSearchWrestlerInput, setShowSearchWrestlerInput] =
    useState<boolean>(false);
  const [searchWrestlerInput, setSearchWrestlerInput] = useState<string>("");

  let token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch("/api/users/getAllUsersInTenantWithNames", requestOptions)
      .then((res) => res.json())
      .then((res) => isMounted && setAllUsersInTenant(res))
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-center align-items-center text-center mt-3">
        <span style={{ fontSize: "1.7rem" }}>
          <u>Wrestlers check-in history</u>
        </span>
      </div>
      {allUsersInTenant && (
        <div className=" mt-2 mb-5">
          <div
            className="d-flex justify-content-end align-items-center"
            style={{ position: "sticky", top: 3, zIndex: 10 }}
          >
            {!showSearchWrestlerInput ? (
              <button
                onClick={() => setShowSearchWrestlerInput(true)}
                className="btn btn-sm btn-success d-flex align-items-center m-3"
                style={{ fontSize: ".7rem" }}
              >
                <div className="mr-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                Search
              </button>
            ) : (
              <input
                className="m-3"
                autoFocus
                type="text"
                placeholder="search wrestlers"
                onChange={(e: any) => setSearchWrestlerInput(e.target.value)}
                style={{ width: "9rem" }}
              />
            )}
          </div>
          {allUsersInTenant
            .filter(
              ({ first_name, last_name }: any) =>
                `${first_name} ${last_name}`
                  .toLowerCase()
                  .indexOf(searchWrestlerInput.toLowerCase()) > -1
            )

            .map((wrestler, index) => {
              return (
                <div
                  key={wrestler.id}
                  style={{
                    backgroundColor: `${
                      index % 2 === 0 ? "rgb(240, 240, 240)" : "white"
                    }`,
                    paddingBottom: "2rem",
                  }}
                >
                  <div
                    onClick={() => {
                      if (showUserId === wrestler.id) setShowUserId(0);
                      else setShowUserId(wrestler.id);
                    }}
                    className="p-3"
                  >
                    <span
                      style={{ fontSize: "1.3rem", cursor: "pointer" }}
                      className="d-flex align-items-center"
                    >
                      {showUserId !== wrestler.id ? (
                        <span className="mr-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#a8a8a8"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </span>
                      ) : (
                        <svg
                          className="mr-1"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      )}
                      <span
                        style={{
                          color: `${
                            wrestler.id === showUserId ? "#4f4f4f" : "black"
                          }`,
                        }}
                      >
                        {wrestler.first_name} {wrestler.last_name}
                      </span>
                    </span>
                  </div>
                  {showUserId === wrestler.id && (
                    <div className="col-12">
                      <PrivateLessonCheckInHistoryForUser
                        userId={wrestler.id}
                      />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default WrestlerCheckInHistoryStart;
