import * as React from "react";
import { useState, useEffect } from "react";
import moment from "moment";
import { ITransactionForPracticeCheckIn } from "./interfacesForPayments";
import * as date from "../services/dateAndTimeFunctions";

const CheckInForPracticesHistory = (props: IProps) => {
  const [allPracticeCheckInHistory, setAllPracticeCheckInHistory] =
    useState<ITransactionForPracticeCheckIn[]>();
  const [searchDateFrom, setSearchDateFrom] = useState<string>();
  const [searchDateTo, setSearchDateTo] = useState<string>();
  const [boolForRender, setBoolForRender] = useState<boolean>(false);
  let tenantId = props.tenantId;

  useEffect(() => {
    let isMounted = true;
    setSearchDateFrom(moment().format("YYYY-MM-DD"));
    setSearchDateTo(moment().format("YYYY-MM-DD"));
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!searchDateFrom || !searchDateTo) return;
    let isMounted = true;
    let todaysDateAndTime = date.createMomentCurrentDateTime();
    let dateFrom = date.createMomentDateStartOfDayFromDateOnly(searchDateFrom);
    let dateTo = date.createMomentDateEndOfDayFromDateOnly(searchDateTo);
    // console.log({ todaysDateAndTime });
    // console.log({ dateFrom });
    // console.log({ dateTo });
    fetch(
      `/api/transactions/getAllCheckInsForTenantWithinDateRange/${tenantId}/${dateFrom}/${dateTo}/${todaysDateAndTime}`
    )
      .then((res) => res.json())
      .then((res) => setAllPracticeCheckInHistory(res))
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, [
    searchDateFrom,
    searchDateTo,
    props.boolForRenderFromParent,
    boolForRender,
  ]);

  let handleSearchDateFromChange = (e: any) => {
    setSearchDateFrom(e.target.value);
  };
  let handleSearchDateToChange = (e: any) => {
    setSearchDateTo(e.target.value);
  };

  let handleRemoveCheckIn = (
    transactionId: number,
    checkInDateAndTime: Date
  ) => {
    if (!confirm("Are you sure you want to remove this check-in?")) return;
    let token = localStorage.getItem("token");
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        transactionId,
        checkInDateAndTime,
        todaysDateAndTime: date.createMomentCurrentDateTime(),
      }),
    };
    fetch("api/transactions/removeTransactionForPractice", requestOptions)
      .then((res) => res.json())
      .then((res) => {
        alert(res.message);
        setBoolForRender(!boolForRender);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h2 className="col-12 text-center">Practice check-in history</h2>
      <div className="d-flex justify-content-center flex-wrap">
        <div className="col-12 text-center">
          <span style={{ fontSize: "1.4rem" }}>
            <strong>Check-in history</strong>
          </span>
        </div>
        <div className="col-12 text-center">
          <span style={{ fontSize: ".8rem" }}>search</span>
        </div>
        <div className="col-12 d-flex flex-wrap justify-content-center align-items-center">
          <div className="col-12 d-flex flex-wrap justify-content-center align-items-center">
            <div className="col-12 text-center">
              <span style={{ fontSize: ".6rem" }}>From:</span> <br />
              <input
                type="date"
                defaultValue={searchDateFrom}
                onChange={handleSearchDateFromChange}
                style={{ fontSize: ".7rem" }}
              />
            </div>
            <div className="col-12 text-center">
              <span style={{ fontSize: ".6rem" }}>To:</span> <br />
              <input
                type="date"
                defaultValue={searchDateTo}
                onChange={handleSearchDateToChange}
                style={{ fontSize: ".7rem" }}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <table className="table table-striped mt-2">
          <thead>
            <tr>
              <th>#</th>
              <th>Wrestler</th>
              <th>Check-in date</th>
              <th>Check-in time</th>
              <th>Checked in by</th>
              <th>Remove check-in</th>
            </tr>
          </thead>
          <tbody>
            {allPracticeCheckInHistory?.map((checkIn, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    {checkIn.wrestler_first_name} {checkIn.wrestler_last_name}{" "}
                    <br />
                    <span style={{ fontSize: ".7rem", color: "gray" }}>
                      {checkIn.wrestlers_email}
                    </span>
                  </td>
                  <td>
                    {moment(checkIn.check_in_date_and_time).format(
                      "MMM DD, YYYY"
                    )}
                  </td>
                  <td>
                    {moment(checkIn.check_in_date_and_time).format("h:mm a")}
                  </td>

                  <td>
                    {checkIn.checked_in_by_first_name}{" "}
                    {checkIn.checked_in_by_last_name} <br />
                    <span style={{ fontSize: ".7rem", color: "gray" }}>
                      {checkIn.checked_in_by_email}
                    </span>
                  </td>
                  <td>
                    <button
                      disabled={
                        checkIn.checkInCanBeRemoved === true ? false : true
                      }
                      onClick={() =>
                        handleRemoveCheckIn(
                          checkIn.id,
                          checkIn.check_in_date_and_time
                        )
                      }
                      className="btn btn-sm btn-danger"
                    >
                      Remove check-in
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CheckInForPracticesHistory;

interface IProps {
  tenantId: number;
  boolForRenderFromParent: boolean;
}
