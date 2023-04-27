import * as React from "react";
import { useState, useEffect } from "react";
import { timeMilitaryToAMPM } from "../../../LessonsSchedulingPagesAndComponents/ServicesForPrivateLessonScheduling/dateTimeHandlingFuncs";
import { ITransactionCheckInHistoryForWrestler } from "../../../payments/interfacesForPayments";
import moment from "moment";

const PrivateLessonCheckInHistoryForUser = (props: IProps) => {
  const [checkInHistory, setCheckInHistory] =
    useState<ITransactionCheckInHistoryForWrestler[]>();
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
      let dateFrom = moment(`${searchDateFrom}`).format("YYYY-MM-DD");
      let dateTo = moment(`${searchDateTo}`).format("YYYY-MM-DD");
      let dateRange = `${moment(searchDateFrom).format(
        "MMM DD, YYYY"
      )} - ${moment(searchDateTo).format("MMM DD, YYYY")}`;
      fetch(
        `/api/transactions/getAllLessonsUsedInMonthSelectedForWrestlerId/${props.userId}/${dateFrom}/${dateTo}`
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

  let addDurationToStartTime = (startTime: string, duration: number) => {
    return moment(`2020-01-01T${startTime}`)
      .add(duration, "hours")
      .format("hh:mm:ss");
  };

  let handleSearchDateFromChange = (e: any) => {
    setSearchDateFrom(e.target.value);
  };
  let handleSearchDateToChange = (e: any) => {
    setSearchDateTo(e.target.value);
  };

  return (
    <div className="">
      <div
        className="d-flex justify-content-center mt-2 mb-5 mr-1 ml-1 flex-wrap p-0"
        style={{ minWidth: "30rem", position: "relative" }}
      >
        <div className="col-12 justify-content-center flex-wrap text-center align-items-center">
        <div className="col-12">
          <span>Private lessons</span>
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
                  <th>Date of lesson</th>
                  <th>Start time</th>
                  <th>End time</th>
                  <th>Coach</th>
                  <th>Price of lesson</th>
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
                          {moment(checkIn.date_of_lesson)
                            .utc()
                            .format("MMM, DD YYYY")}
                        </span>
                      </td>
                      <td>
                        {" "}
                        <span>
                          {timeMilitaryToAMPM(checkIn.lesson_start_time)}
                        </span>
                      </td>
                      <td>
                        <span className="">
                          {timeMilitaryToAMPM(
                            addDurationToStartTime(
                              checkIn.lesson_start_time,
                              checkIn.duration
                            )
                          )}
                        </span>
                      </td>
                      <td>
                        <span className="">
                          {checkIn.coach_first_name} {checkIn.coach_last_name}{" "}
                          <br />
                          <span style={{ fontSize: ".6rem", color: "gray" }}>
                            {checkIn.coach_email}
                          </span>
                        </span>
                      </td>
                      <td>
                        <span className="">
                          ${Number(checkIn.price_paid_for_lesson)}
                        </span>
                      </td>
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
          <div>
            <span>No check-in's</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateLessonCheckInHistoryForUser;

interface IProps {
  userId: number;
}
