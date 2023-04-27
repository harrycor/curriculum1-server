import * as React from "react";
import { useState, useEffect } from "react";
import { ICoachsInfoWithPayoutPercentage } from "./interfacesForPayments";

const PayoutPercentages = () => {
  const [
    allCoachsUserInformationWithPayoutPercentages,
    setAllCoachsUserInformationWithPayoutPercentages,
  ] = useState<ICoachsInfoWithPayoutPercentage[]>();
  const [editPrcentageOfUserId, setEditPrcentageOfUserId] = useState<number>(0);
  const [editPayoutPercentage, setEditPayoutPercentage] = useState<
    number | null
  >();
  const [reRenderBool, setReRenderBool] = useState<boolean>(false);
  const [showSearchCoachInput, setShowSearchCoachInput] =
    useState<boolean>(false);
  const [searchCoachInput, setSearchCoachInput] = useState<string>("");

  let token = localStorage.getItem("token");

  useEffect(() => {
    let isMouted = true;
    let token = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(
      "/api/payoutPercentages/getAllCoachsUserInformationWithPayoutPercentages",
      requestOptions
    )
      .then((res) => res.json())
      .then(
        (res) =>
          isMouted && setAllCoachsUserInformationWithPayoutPercentages(res)
      )
      .catch((err) => console.log(err));
    return () => {
      isMouted = false;
    };
  }, [reRenderBool]);

  let handleEditOrAddPercentagePayoutClicked = (
    userId: number,
    currentPayoutPercentage: number | null
  ) => {
    if (editPrcentageOfUserId === userId) {
      setEditPrcentageOfUserId(0);
    } else {
      setEditPrcentageOfUserId(userId);
      setEditPayoutPercentage(currentPayoutPercentage);
    }
  };

  let getRequestOptions = (method: string, body: {} | null = null) => {
    return {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    };
  };

  let handleSubmitPayoutPercentageClicked = async (
    userId: number,
    currentPayoutPercentage: number | null,
    coachsName: string,
    payoutPercentageId: number | null
  ) => {
    if (
      confirm(
        currentPayoutPercentage
          ? `Are You sure you want to update the payout percentage of, ${coachsName}?\nFrom: ${currentPayoutPercentage}%\nTo: ${editPayoutPercentage}%`
          : `Are you sure you want to add payout percentage of ${editPayoutPercentage}% for ${coachsName}?`
      )
    ) {
      // create new
      const requestOptions = getRequestOptions("POST", {
        coachsUserId: userId,
        payoutPercentageOfPrivateLessons: editPayoutPercentage,
      });
      await fetch(
        "/api/payoutPercentages/createNewPayoutPercentage",
        requestOptions
      )
        .then((res) => res.json())
        .then((res) => alert(res.message))
        .catch((err) => console.log(err));
    }
    setReRenderBool(!reRenderBool);
    setEditPrcentageOfUserId(0);
  };

  return (
    <div className="p-1 mb-5">
      <div className="d-flex justify-content-center text-center m-3">
        <span style={{ fontSize: "1.7rem" }}>
          <u>Payout percentages for private lessons</u>
        </span>
      </div>
      <div style={{ position: "sticky", top: 3, zIndex: 10 }}>
        {
          <div className="col-12 d-flex justify-content-center">
            <div className="d-flex justify-content-end align-items-center col-sm-6 col-12">
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
          </div>
        }
      </div>
      <div
        className="d-flex justify-content-center"
        style={{
          position: "sticky",
          top: "0",
          zIndex: 9,
          backgroundColor: "white",
        }}
      >
        <div
          className="d-flex justify-content-center col-sm-6 col-12 p-0"
          style={{
            borderBottom: "solid lightgray 1px",
            backgroundColor: "lightgray",
          }}
        >
          <div className="col-7 d-flex justify-content-start align-items-center">
            <span style={{ fontSize: "1rem" }}>
              <strong>Coach</strong>
            </span>
          </div>
          <div className="col-5 d-flex justify-content-start align-items-center">
            <span style={{ fontSize: "1rem" }}>
              <strong>Payout %</strong>
            </span>
          </div>
        </div>
      </div>
      <div>
        {allCoachsUserInformationWithPayoutPercentages &&
          allCoachsUserInformationWithPayoutPercentages
            .filter(
              ({ first_name, last_name }: any) =>
                `${first_name} ${last_name}`
                  .toLowerCase()
                  .indexOf(searchCoachInput.toLowerCase()) > -1
            )

            .map((coach, index) => {
              return (
                <div key={coach.id} className="d-flex justify-content-center">
                  <div
                    className="d-flex justify-content-around align-items-center col-sm-6 col-12 p-0 pt-3 pb-3"
                    style={{
                      height: "4.5rem",
                      backgroundColor: `${
                        index % 2 === 0 ? "#F0F0F0" : "white"
                      }`,
                    }}
                  >
                    <div className="col-7 d-flex justify-content-center flex-wrap align-items-center">
                      <span className="col-12 p-0">
                        {" "}
                        {coach.first_name} {coach.last_name}
                      </span>
                      <span
                        className="col-12 p-0"
                        style={{ color: "#585858", fontSize: ".7rem" }}
                      >
                        {coach.email}
                      </span>
                    </div>
                    <div className="col-5 d-flex justify-content-start align-items-center">
                      {editPrcentageOfUserId !== coach.id && (
                        <>
                          {coach.payout_percentage_of_private_lessons ? (
                            <div>
                              <div className="d-flex justify-content-start  align-items-center">
                                <span
                                  className="pl-1 pr-1"
                                  style={{
                                    border: "solid green 1px",
                                    borderRadius: ".7rem",
                                  }}
                                >
                                  {coach.payout_percentage_of_private_lessons}
                                  <span style={{ fontSize: ".6rem" }}>%</span>
                                </span>
                                <span
                                  className="ml-1"
                                  style={{
                                    color: "gray",
                                    fontSize: ".7rem",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  per lesson
                                </span>
                              </div>
                              <div>
                                <span
                                  onClick={() =>
                                    handleEditOrAddPercentagePayoutClicked(
                                      coach.id,
                                      coach.payout_percentage_of_private_lessons
                                    )
                                  }
                                  style={{
                                    color: "blue",
                                    cursor: "pointer",
                                    fontSize: ".8rem",
                                  }}
                                >
                                  <u>edit</u>
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span
                              onClick={() =>
                                handleEditOrAddPercentagePayoutClicked(
                                  coach.id,
                                  coach.payout_percentage_of_private_lessons
                                )
                              }
                              style={{
                                fontSize: ".8rem",
                                color: "blue",
                                cursor: "pointer",
                              }}
                            >
                              <u>Add payout percentage</u>
                            </span>
                          )}
                        </>
                      )}

                      <div>
                        {editPrcentageOfUserId === coach.id && (
                          <div className="d-flex flex-wrap justify-content-start align-items-center">
                            <div className="col-7 p-0">
                              <span
                                style={{
                                  fontSize: ".8rem",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <input
                                  onChange={(e: any) =>
                                    setEditPayoutPercentage(
                                      Number(e.target.value.trim())
                                    )
                                  }
                                  defaultValue={
                                    Number(
                                      coach.payout_percentage_of_private_lessons
                                    )
                                      ? Number(
                                          coach.payout_percentage_of_private_lessons
                                        )
                                      : undefined
                                  }
                                  autoFocus
                                  // placeholder=""
                                  type="number"
                                  max={100}
                                  min={0}
                                  style={{ width: "3rem" }}
                                />{" "}
                                %
                              </span>
                            </div>
                            {editPayoutPercentage !== null &&
                              editPayoutPercentage !== undefined &&
                              editPayoutPercentage > -1 &&
                              editPayoutPercentage < 101 &&
                              editPayoutPercentage !==
                                coach.payout_percentage_of_private_lessons && (
                                <div
                                  className="col-5"
                                  style={{
                                    paddingLeft: ".3rem",
                                    paddingRight: "0",
                                  }}
                                >
                                  <button
                                    onClick={() =>
                                      handleSubmitPayoutPercentageClicked(
                                        coach.id,
                                        coach.payout_percentage_of_private_lessons,
                                        `${coach.first_name} ${coach.last_name}`,
                                        coach.payout_percentage_id
                                      )
                                    }
                                    className="btn btn-sm btn-success d-flex justify-content-center align-items-center m-1"
                                    style={{
                                      height: "1.5rem",
                                      width: "2.6rem",
                                      fontSize: ".7rem",
                                    }}
                                  >
                                    Submit
                                  </button>
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default PayoutPercentages;
