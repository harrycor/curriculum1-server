import * as React from "react";
import { useState, useEffect } from "react";
import { ITransactionForPracticeCHeckIn } from "../../../payments/interfacesForPayments";
import moment from "moment";
import * as date from "../../../services/dateAndTimeFunctions";

const PracticeCheckInHistoryForUser = (props: IProps) => {
  const [checkInHistory, setCheckInHistory] =
    useState<ITransactionForPracticeCHeckIn[]>();
  const [searchDateFrom, setSearchDateFrom] = useState<string>();
  const [searchDateTo, setSearchDateTo] = useState<string>();
  const [dateRangeSelectedForDisplay, setDateRangeSelectedForDisplay] =
    useState<string>();

  useEffect(() => {
    let isMounted = true;
    setSearchDateFrom(moment().subtract(1, "months").format("YYYY-MM-DD"));
    setSearchDateTo(moment().format("YYYY-MM-DD"));
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (
      searchDateFrom &&
      searchDateTo &&
      searchDateFrom.length > 0 &&
      searchDateTo.length > 0
    ) {
      // console.log("wt");
      // console.log(searchDateFrom);
      // console.log(searchDateTo);
      // let dateFrom = moment(`${searchDateFrom}`).format("YYYY-MM-DD");
      // let dateTo = moment(`${searchDateTo}`).format("YYYY-MM-DD");
      let dateRange = `${moment(searchDateFrom).format(
        "MMM DD, YYYY"
      )} - ${moment(searchDateTo).format("MMM DD, YYYY")}`;
      let dateFrom =
        date.createMomentDateStartOfDayFromDateOnly(searchDateFrom);
      let dateTo = date.createMomentDateEndOfDayFromDateOnly(searchDateTo);
      fetch(
        `/api/transactions/getAllPracticeCheckInsInMonthSelectedForWrestlerId/${props.userId}/${dateFrom}/${dateTo}`
      )
        .then((res) => res.ok && res.json())
        .then((res) => {
          if (isMounted) {
            setCheckInHistory(res);
            setDateRangeSelectedForDisplay(dateRange);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [searchDateFrom, searchDateTo]);

  let handleSearchDateFromChange = (e: any) => {
    setSearchDateFrom(e.target.value);
  };
  let handleSearchDateToChange = (e: any) => {
    setSearchDateTo(e.target.value);
  };

  return (
    <div
      className="d-flex justify-content-center mt-2 mb-5 flex-wrap p-0"
      style={{ position: "relative" }}
    >
      <div className="col-md-6 col-12">
        <div className="col-12 justify-content-center flex-wrap text-center align-items-center">
          <div className="col-12 ">
            <div className="col-12">
              <span>Practices</span>
            </div>
          </div>
          <div className="col-12 ">
            <span style={{ fontSize: ".8rem" }}>search</span>
          </div>
          <div className="col-12 d-flex flex-wrap justify-content-center align-items-center">
            <div className="col-12 d-flex flex-wrap justify-content-center align-items-center">
              <div className="col-12">
                <span style={{ fontSize: ".6rem" }}>From:</span> <br />
                <input
                  type="date"
                  defaultValue={searchDateFrom}
                  onChange={handleSearchDateFromChange}
                  style={{ fontSize: ".7rem" }}
                />
              </div>
              <div className="col-12">
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
        {checkInHistory && checkInHistory.length > 0 ? (
          <div style={{ display: "inline" }}>
            <div className="col-12 d-flex justify-content-center text-center mt-1">
              <span style={{ fontSize: ".5rem", color: "gray" }}>
                Showing: <br />
                {dateRangeSelectedForDisplay}
              </span>
            </div>
            <table className="table table-striped">
              <thead
                style={{ position: "sticky", top: 0, backgroundColor: "white" }}
              >
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Check-in info</th>
                </tr>
              </thead>
              <tbody>
                {checkInHistory?.map((checkIn, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <span className="" style={{ fontSize: ".8rem" }}>
                          {/* {moment(checkIn.date_of_lesson.split("T")[0])
                        .utc()
                        .format("MMM, DD, YYYY")} */}
                          {moment(checkIn.check_in_date_and_time).format(
                            "MMM, DD YYYY"
                          )}
                        </span>
                      </td>
                      <td>
                        <span className="" style={{ fontSize: ".8rem" }}>
                          {/* {moment(checkIn.date_of_lesson.split("T")[0])
                        .utc()
                        .format("MMM, DD, YYYY")} */}
                          {moment(checkIn.check_in_date_and_time).format(
                            "h:mm a"
                          )}
                        </span>
                      </td>
                      {/* <td>
                        <span className="">
                          ${Number(checkIn.price_paid_for_lesson)}
                        </span>
                      </td> */}
                      <td style={{ fontSize: ".8rem" }}>
                        {moment(checkIn.check_in_date_and_time).format(
                          "MMM DD, YYYY"
                        )}{" "}
                        <br />
                        {moment(checkIn.check_in_date_and_time).format(
                          "h:mm a"
                        )}
                        <br />
                        <span style={{ fontSize: ".7rem" }}>
                          {checkIn.checked_in_by_first_name}
                          {checkIn.checked_in_by_last_name} <br />
                          <span style={{ fontSize: ".6rem" }}>
                            {checkIn.checked_in_by_email}
                          </span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">
            <span>No check-in's</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeCheckInHistoryForUser;

interface IProps {
  userId: number;
}
