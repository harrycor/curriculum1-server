import * as React from "react";
import moment from "moment";
import { useState, useEffect } from "react";
import { ITransactionWithPurchaseInfo } from "../../../payments/interfacesForPayments";
import * as date from "../../../services/dateAndTimeFunctions";

const PrivateLessonPurchasesForUser = (props: IProps) => {
  const [privateLessonPurchaseHistory, setPrivateLessonPurchaseHistory] =
    useState<ITransactionWithPurchaseInfo[]>();
  const [numberOfLessonsRemaining, setNumberOfLessonsRemaining] =
    useState<number>();
  const [searchDateFrom, setSearchDateFrom] = useState<string>();
  const [searchDateTo, setSearchDateTo] = useState<string>();
  let token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;
    isMounted &&
      setSearchDateFrom(moment().subtract(3, "months").format("YYYY-MM-DD"));
    isMounted && setSearchDateTo(moment().format("YYYY-MM-DD"));
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!searchDateFrom || !searchDateTo) return;
    let isMounted = true;
    let dateFrom = date.createMomentDateStartOfDayFromDateOnly(searchDateFrom);
    let dateTo = date.createMomentDateEndOfDayFromDateOnly(searchDateTo);
    // console.log(dateFrom);
    // console.log(dateTo);
    fetch(
      `/api/transactions/getAllPrivateLessonPurchasesForWrestler/${dateFrom}/${dateTo}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then(
        (res: {
          amountOfLessonsRemaining: number;
          privateLessonPurchasesMadeByUser: ITransactionWithPurchaseInfo[];
        }) => {
          if (isMounted) {
            setNumberOfLessonsRemaining(res.amountOfLessonsRemaining);
            setPrivateLessonPurchaseHistory(
              res.privateLessonPurchasesMadeByUser
            );
          }
        }
      )
      .catch((err) => console.log(err));
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
    <div>
      <div className="d-flex justify-content-center text-center flex-wrap">
        <div className="col-12">
          <span>Private lessons</span>
        </div>
        <div className="col-12 m-1">
          <span style={{ fontSize: ".7rem" }}>
            Total lessons remaining: <strong>{numberOfLessonsRemaining}</strong>
          </span>
        </div>

        <div className="col-12 justify-content-center flex-wrap text-center align-items-center">
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
      </div>
      {privateLessonPurchaseHistory &&
      privateLessonPurchaseHistory.length > 0 ? (
        <div>
          <table className="table table-striped">
            <thead
              style={{ position: "sticky", top: 0, backgroundColor: "white" }}
            >
              <tr>
                <th>Item</th>
                <th># of items</th>
                <th>Status</th>
                <th>Date used</th>
                <th>Amount</th>
                <th>Purchase date</th>
              </tr>
            </thead>
            <tbody>
              {privateLessonPurchaseHistory.map((lessonPurchase, index) => {
                return (
                  <tr key={index}>
                    <td>{lessonPurchase.name_of_item}</td>
                    <td> x {lessonPurchase.number_of_items_included}</td>
                    <td>
                      {Number(lessonPurchase.number_of_lessons_remaining) ===
                      0 ? (
                        <span style={{ color: "red" }}>Used</span>
                      ) : (
                        <span>
                          {lessonPurchase.number_of_lessons_remaining}{" "}
                          <span style={{ fontSize: ".6rem" }}>Remaining</span>
                        </span>
                      )}
                    </td>
                    <td>
                      <table
                        className="table"
                        style={{
                          maxHeight: "15rem",
                          overflow: "auto",
                          display: "block",
                        }}
                      >
                        <tbody>
                          {lessonPurchase.datesOfUsedPrivateLessons &&
                          lessonPurchase.datesOfUsedPrivateLessons.length >
                            0 ? (
                            lessonPurchase.datesOfUsedPrivateLessons.map(
                              (dateOfUsedPrivateLesson, index) => {
                                return (
                                  <tr
                                    key={index}
                                    style={{
                                      fontSize: ".6rem",
                                      borderTop: "none",
                                      backgroundColor: "transparent",
                                    }}
                                  >
                                    <td
                                      style={{
                                        borderTop: "none",
                                        padding: ".4rem",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {moment(dateOfUsedPrivateLesson)
                                        .utc()
                                        .format("MMM DD, YYYY")}
                                    </td>
                                  </tr>
                                );
                              }
                            )
                          ) : (
                            <tr
                              key={index}
                              style={{ backgroundColor: "transparent" }}
                            >
                              <td
                                style={{
                                  borderTop: "none",
                                  padding: ".4rem",
                                }}
                              >
                                <span style={{ fontSize: "1rem" }}>-</span>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </td>
                    <td>
                      ${lessonPurchase.total_price_of_service_or_merchandise}
                    </td>
                    <td style={{ fontSize: ".6rem" }}>
                      {moment(lessonPurchase.purchase_date).format(
                        "MMM DD, YYYY"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="d-flex justify-content-center algin-items-center text-center">
          <span>No purchase history</span>
        </div>
      )}
    </div>
  );
};
export default PrivateLessonPurchasesForUser;
interface IProps {}
