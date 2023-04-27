import * as React from "react";
import { useState, useEffect } from "react";
import { apiService } from "../services/api-services";
import { timeMilitaryToAMPM } from "../LessonsSchedulingPagesAndComponents/ServicesForPrivateLessonScheduling/dateTimeHandlingFuncs";
import { ITransactionCheckInHistoryForCoach } from "./interfacesForPayments";
import moment from "moment";
// import CoachCheckInHistory from "./CoachCheckInHistory";

const CoachCheckInHistoryAndEarnings = (props: IProps) => {
  const [checkInHistory, setCheckInHistory] =
    useState<ITransactionCheckInHistoryForCoach[]>();
  const [grossEarnings, setGrossEarnings] = useState<number>();
  const [selectedDateRangeEarnings, setSelectedDateRangeEarnings] =
    useState<number>();
  const [
    selectedDateRangeEarningsForDisplay,
    setselectedDateRangeEarningsForDisplay,
  ] = useState<string>();
  const [searchDateFrom, setSearchDateFrom] = useState<string>();
  const [searchDateTo, setSearchDateTo] = useState<string>();

  useEffect(() => {
    let isMounted = true;
    isMounted &&
      setSearchDateFrom(moment().subtract(1, "months").format("YYYY-MM-DD"));
    isMounted && setSearchDateTo(moment().format("YYYY-MM-DD"));
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
      // let dateFrom = moment(`${searchDateFrom}`).format("YYYY-MM-DD");
      let dateFrom = searchDateFrom;
      // let dateTo = moment(`${searchDateTo}`).format("YYYY-MM-DD");
      let dateTo = searchDateTo;
      let selectedDateRangeForDisplay = `${moment(searchDateFrom).format(
        "MMM DD, YYYY"
      )} - ${moment(searchDateTo).format("MMM DD, YYYY")}`;
      fetch(
        `/api/transactions/getAllLessonsUsedInSelectedDateRangeForCoachId/${props.userId}/${dateFrom}/${dateTo}`
      )
        .then((res) => res.ok && res.json())
        .then(
          (res: {
            privateLessonTransactionsForCoachInDateRange: ITransactionCheckInHistoryForCoach[];
            coachesLifetimeEarningsForPrivateLessons: number;
            coachesLifetimeEarningsForPrivateLessonsDateRange: number;
          }) => {
            if (isMounted) {
              setCheckInHistory(
                res.privateLessonTransactionsForCoachInDateRange
              );
              setGrossEarnings(res.coachesLifetimeEarningsForPrivateLessons);
              setSelectedDateRangeEarnings(
                res.coachesLifetimeEarningsForPrivateLessonsDateRange
              );
              setselectedDateRangeEarningsForDisplay(
                selectedDateRangeForDisplay
              );
            }
          }
        )
        .catch((err) => console.log(err));
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
    <div className="mb-3 p-2">
      <div className="d-flex align-items-center justify-content-start">
        <span style={{ fontSize: "1rem" }}>
          Lifetime earnings:{" "}
          <span>
            <span style={{ color: "black", fontSize: ".8rem" }}>$</span>
            <strong style={{ color: "darkgreen", fontSize: "1.3rem" }}>
              {grossEarnings}
            </strong>
          </span>
        </span>
      </div>
      <div className="d-flex align-items-center justify-content-start">
        <span style={{ fontSize: "1rem" }}>
          <span style={{ fontSize: ".9rem" }}>
            {selectedDateRangeEarningsForDisplay}:{" "}
          </span>
          <span>
            <span style={{ color: "black", fontSize: ".8rem" }}>$</span>
            <strong style={{ color: "darkgreen", fontSize: "1.3rem" }}>
              {selectedDateRangeEarnings}
            </strong>
          </span>
        </span>
      </div>
      <div>
        <div>
          {/*  */}
          <>
            <div
              className="d-flex justify-content-center mt-2 mb-5 mr-1 ml-1 flex-wrap p-0"
              style={{ minWidth: "30rem", position: "relative" }}
            >
              <div className="col-12 justify-content-center flex-wrap text-center align-items-center">
                <div className="col-12 ">
                  <span style={{ fontSize: "1.4rem" }}>
                    <strong>Check-in history</strong>
                  </span>
                </div>
                <div className="col-12 ">
                  <span style={{ fontSize: ".8rem" }}>search</span>
                </div>
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

              {checkInHistory && checkInHistory.length > 0 ? (
                <div style={{ display: "inline" }}>
                  <div className="col-12 d-flex justify-content-center text-center mt-1">
                    <span style={{ fontSize: ".5rem", color: "gray" }}>
                      Showing: <br />
                      {selectedDateRangeEarningsForDisplay}
                    </span>
                  </div>
                  <table className="table table-striped">
                    <thead
                      style={{
                        fontSize: ".8rem",
                        position: "sticky",
                        top: 0,
                        backgroundColor: "white",
                      }}
                    >
                      <tr className="col-2">
                        <th>Date of lesson</th>
                        <th>Time of lesson</th>
                        <th>Wrestler</th>
                        <th>Price of lesson</th>
                        <th>Amount kept by coach</th>
                        <th>Check-in info</th>
                      </tr>
                    </thead>
                    <tbody>
                      {checkInHistory?.map((checkIn, index) => {
                        return (
                          <tr key={index}>
                            <td style={{ fontSize: ".8rem" }}>
                              {moment(checkIn.date_of_lesson)
                                .utc()
                                .format("MMM DD, YYYY")}
                            </td>
                            <td>
                              <span>
                                {timeMilitaryToAMPM(checkIn.lesson_start_time)}
                              </span>{" "}
                              <br />
                              <span style={{ fontSize: ".6rem" }}>to</span>{" "}
                              <br />
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
                                {checkIn.wrestler_first_name}{" "}
                                {checkIn.wrestler_last_name}{" "}
                                <span
                                  style={{ fontSize: ".6rem", color: "gray" }}
                                >
                                  {" "}
                                  <br />
                                  {checkIn.wrestler_email}
                                </span>
                              </span>
                            </td>
                            <td>${Number(checkIn.price_paid_for_lesson)}</td>
                            <td>
                              <span>
                                $
                                {Number(
                                  (checkIn.payout_percentage_of_private_lessons /
                                    100) *
                                    checkIn.price_paid_for_lesson
                                ).toFixed(2)}
                              </span>{" "}
                              <br />
                              <span
                                style={{ fontSize: ".8rem", color: "gray" }}
                              >
                                (
                                {checkIn.payout_percentage_of_private_lessons
                                  ? Number(
                                      checkIn.payout_percentage_of_private_lessons
                                    )
                                  : 0}
                                %)
                              </span>
                            </td>
                            <td>
                              <span>
                                {checkIn.checked_in_by_first_name}
                                {checkIn.checked_in_by_last_name} <br />
                                <span
                                  style={{
                                    fontSize: ".5rem",
                                    color: "gray",
                                  }}
                                >
                                  {checkIn.checked_in_by_email}
                                </span>
                              </span>
                              <br />
                              <span style={{ fontSize: ".6rem" }}>
                                <span>
                                  {moment(
                                    checkIn.check_in_date_and_time
                                  ).format("MMM DD, YYYY")}
                                </span>
                                <br />
                                <span>
                                  {moment(
                                    checkIn.check_in_date_and_time
                                  ).format("h:mm a")}
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
          </>
          {/*  */}
        </div>
      </div>
    </div>
  );
};

export default CoachCheckInHistoryAndEarnings;

interface IProps {
  userId: number;
}
