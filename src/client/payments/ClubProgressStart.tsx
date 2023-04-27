import * as React from "react";
import { useState, useEffect } from "react";
import moment from "moment";

const ClubProgressStart = () => {
  const [
    clubLifetimeEarningsFromLessonsSold,
    setClubLifetimeEarningsFromLessonsSold,
  ] = useState<string>();
  const [
    clubLifetimeEarningsFromLessonsUsed,
    setClubLifetimeEarningsFromLessonsUsed,
  ] = useState<string>();
  const [clubLifetimeEarningsFromMerch, setClubLifetimeEarningsFromMerch] =
    useState<string>();
  const [dateRageEarnings, setDateRageEarnings] = useState<string>();
  const [tenantName, setTenantName] = useState<string>();
  const [dateFrom, setDateFrom] = useState<string>();
  const [dateTo, setDateTo] = useState<string>();
  let token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setDateFrom(moment().utc().format("YYYY-MM-DD"));
      setDateTo(moment().add(1, "month").utc().format("YYYY-MM-DD"));
    }
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/tenants/getTenantName", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(([res]) => isMounted && setTenantName(res.tenant_name))
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, []);

  //   lifetime total and date range
  // useEffect(() => {
  //   let isMounted = true;
  //   fetch("/api/lessonsUsed/getClubLifetimeEarnings", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then(
  //       (res: {
  //         clubsLifetimeEarningsFromMerch: string;
  //         clubsLifetimeEarningsFromLessonsSold: string;
  //         clubsLifetimeEarningsFromLessonsUsed: string;
  //       }) => {
  //         if (isMounted) {
  //           setClubLifetimeEarningsFromLessonsSold(
  //             res.clubsLifetimeEarningsFromLessonsSold
  //           );
  //           setClubLifetimeEarningsFromLessonsUsed(
  //             res.clubsLifetimeEarningsFromLessonsUsed
  //           );
  //           setClubLifetimeEarningsFromMerch(
  //             res.clubsLifetimeEarningsFromMerch
  //           );
  //         }
  //       }
  //     )
  //     .catch((err) => console.log(err));
  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  // useEffect(() => {
  //   let isMounted = true;
  //   if (dateFrom && dateTo && dateFrom.length > 0 && dateTo.length > 0) {
  //     fetch(
  //       `/api/lessonsUsed/getClubEarningsWithinDateRange/${dateFrom}/${dateTo}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     )
  //       .then((res) => res.json())
  //       .then((res) => isMounted && setDateRageEarnings(res))
  //       .catch((err) => console.log(err));
  //   }
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [dateFrom, dateTo]);

  let handleDateFromChange = (e: any) => {
    setDateFrom(e.target.value);
  };
  let handleDateToChange = (e: any) => {
    setDateTo(e.target.value);
  };
  return (
    <div className="col-12 text-center">
      <h3>Coming soon!</h3>
    </div>
  );

  return (
    <div>
      <div className="d-flex justify-content-center m-4">
        <span style={{ fontSize: "1.4rem" }}>{tenantName}'s progress</span>
      </div>
      <div className="d-flex justify-content-center align-items-start m-3">
        <div className="ml-1 mr-1">
          <span>Lifetime Earnings:</span> <br />
          <span style={{ fontSize: ".6rem", color: "gray" }}>
            (Lessons sold)
          </span>
        </div>
        <span
          style={{ fontSize: "1.1rem", color: "green" }}
          className="d-flex align-items-center"
        >
          <span style={{ color: "black", fontSize: ".8rem" }}>$</span>
          {clubLifetimeEarningsFromLessonsSold}
        </span>
      </div>
      <div className="d-flex justify-content-center align-items-start m-3">
        <div className="ml-1 mr-1">
          <span>Lifetime Earnings:</span> <br />
          <span style={{ fontSize: ".6rem", color: "gray" }}>
            (Lessons used)
          </span>
        </div>
        <span
          style={{ fontSize: "1.1rem", color: "green" }}
          className="d-flex align-items-center"
        >
          <span style={{ color: "black", fontSize: ".8rem" }}>$</span>
          {clubLifetimeEarningsFromLessonsUsed}
        </span>
      </div>
      <div className="d-flex justify-content-center align-items-start m-3">
        <div className="ml-1 mr-1">
          <span>Lifetime Earnings:</span> <br />
          <span style={{ fontSize: ".6rem", color: "gray" }}>(Merch)</span>
        </div>
        <span
          style={{ fontSize: "1.1rem", color: "green" }}
          className="d-flex align-items-center"
        >
          <span style={{ color: "black", fontSize: ".8rem" }}>$</span>
          {clubLifetimeEarningsFromMerch}
        </span>
      </div>
      <div className="d-flex justify-content-center flex-wrap m-3">
        <div className="col-12 d-flex justify-content-center align-items-start">
          <div className="ml-1 mr-1">
            <span style={{ fontSize: ".7rem" }}>
              {moment(dateFrom).utc().format("MMM DD, YYYY")} -{" "}
              {moment(dateTo).utc().format("MMM DD, YYYY")}:
            </span>{" "}
            <br />
            <span style={{ fontSize: ".6rem", color: "gray" }}>
              (Lessons used)
            </span>
          </div>
          <span
            style={{ fontSize: "1.1rem", color: "green" }}
            className="d-flex align-items-center"
          >
            <span style={{ color: "black", fontSize: ".8rem" }}>$</span>
            {dateRageEarnings}
          </span>
        </div>
        <div className="col-12 d-flex justify-content-center flex-wrap">
          <div className="col-12 text-center">
            <span style={{ fontSize: ".6rem", color: "gray" }}>From</span>
          </div>
          <input
            defaultValue={dateFrom}
            onChange={handleDateFromChange}
            type="date"
          />
        </div>
        <div className="col-12 d-flex justify-content-center flex-wrap">
          <div className="col-12 text-center">
            <span style={{ fontSize: ".6rem", color: "gray" }}>to</span>
          </div>
          <input
            defaultValue={dateTo}
            onChange={handleDateToChange}
            type="date"
          />
        </div>
      </div>
    </div>
  );
};

export default ClubProgressStart;
