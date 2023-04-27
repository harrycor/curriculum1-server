import * as React from "react";
import { useState, useEffect } from "react";
import { apiService } from "../services/api-services";
import { IUsersForTenant } from "./interfacesForPayments";
import CoachCheckInHistoryAndEarnings from "./CoachCheckInHistoryAndEarnings";

const CoachsCheckInHistoryAndEarningsStart = () => {
  const [allCoachs, setAllCoachs] = useState<IUsersForTenant[]>();
  const [showUserId, setShowUserId] = useState<number>(0);
  const [showSearchCoachInput, setShowSearchCoachInput] =
    useState<boolean>(false);
  const [searchCoachInput, setSearchCoachInput] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    apiService(
      "/api/users/getAllCoachsAndAdminsInTenantWithNames",
      "POST"
    ).then((res) => isMounted && setAllCoachs(res));
    return () => {
      isMounted = false;
    };
  }, []);

  let handleCoachClicked = (userId: number) => {
    if (userId === showUserId) {
      setShowUserId(0);
    } else {
      setShowUserId(userId);
    }
  };

  return (
    <div className="mb-5">
      <div className="d-flex justify-content-center align-items-center text-center m-3">
        <span style={{ fontSize: "1.7rem" }}>
          <u>Coachs check-in history and earnings</u>
        </span>
      </div>
      {allCoachs && allCoachs.length > 0 ? (
        <div>
          {
            <div
              className="d-flex justify-content-end align-items-center"
              style={{ position: "sticky", top: 3, zIndex: 10 }}
            >
              {!showSearchCoachInput ? (
                <button
                  onClick={() => setShowSearchCoachInput(true)}
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
                  placeholder="search coachs"
                  onChange={(e: any) => setSearchCoachInput(e.target.value)}
                  style={{ width: "9rem" }}
                />
              )}
            </div>
          }
          {allCoachs
            .filter(
              ({ first_name, last_name }: any) =>
                `${first_name} ${last_name}`
                  .toLowerCase()
                  .indexOf(searchCoachInput.toLowerCase()) > -1
            )

            .map((coach, index) => {
              return (
                <div
                  key={coach.id}
                  style={{
                    backgroundColor: `${
                      index % 2 === 0 ? "rgb(240,240,240)" : "white"
                    }`,
                    minHeight: "4rem",
                  }}
                  className="d-flex justify-content-start align-items-center flex-wrap"
                >
                  <div
                    className="d-flex flex-wrap col-12"
                    onClick={() => handleCoachClicked(coach.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      {showUserId !== coach.id ? (
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
                    </div>
                    <div
                      style={{
                        color: `${
                          showUserId === coach.id ? "#4f4f4f" : "black"
                        }`,
                      }}
                    >
                      <div className="col-12 pl-1 pr-1">
                        <span style={{ fontSize: "1.3rem" }}>
                          {coach.first_name} {coach.last_name}
                        </span>
                      </div>
                      <div className="col-12 pl-1 pr-1">
                        <span style={{ fontSize: ".8rem" }}>{coach.email}</span>
                      </div>
                    </div>
                  </div>
                  {coach.id === showUserId && (
                    <>
                      <div className="col-12">
                        <CoachCheckInHistoryAndEarnings userId={coach.id} />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      ) : (
        <div>
          <span>Wheres your team!?</span>
        </div>
      )}
    </div>
  );
};

export default CoachsCheckInHistoryAndEarningsStart;
