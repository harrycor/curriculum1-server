import * as React from "react";
import { useState, useEffect } from "react";
import moment from "moment";
import { ITransactionWithPurchaseInfo } from "../../../payments/interfacesForPayments";
import * as date from "../../../services/dateAndTimeFunctions";

const PracticePurchasesForUser = () => {
  const [practicePurchaseHistory, setPracticePurchaseHistory] =
    useState<ITransactionWithPurchaseInfo[]>();
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
    fetch(
      `/api/transactions/getAllPracticePurchasesForWrestler/${dateFrom}/${dateTo}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((res) => setPracticePurchaseHistory(res))
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
          <span>Practices</span>
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
      <div>
        {practicePurchaseHistory && practicePurchaseHistory.length > 0 ? (
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
                  <th>Expiration date</th>
                </tr>
              </thead>
              <tbody>
                {practicePurchaseHistory.map((practicePurchase, index) => {
                  return (
                    <tr key={index}>
                      <td>{practicePurchase.name_of_item}</td>
                      <td> x {practicePurchase.number_of_items_included}</td>
                      <td>
                        {practicePurchase.is_unlimited == 1 ? (
                          <span style={{ fontSize: ".6rem" }}>Unlimited</span>
                        ) : Number(
                            practicePurchase.number_of_practices_remaining
                          ) === 0 ? (
                          <span style={{ color: "red" }}>Used</span>
                        ) : (
                          <span>
                            {practicePurchase.number_of_practices_remaining}{" "}
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
                            {practicePurchase.datesOfUsedPractices &&
                            practicePurchase.datesOfUsedPractices.length > 0 ? (
                              practicePurchase.datesOfUsedPractices.map(
                                (dateOfUsedPractice, index) => {
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
                                        {moment(dateOfUsedPractice)
                                          // .utc()
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
                        $
                        {practicePurchase.total_price_of_service_or_merchandise}
                      </td>
                      <td style={{ fontSize: ".6rem" }}>
                        {moment(practicePurchase.purchase_date).format(
                          "MMM DD, YYYY"
                        )}
                      </td>
                      <td style={{ fontSize: ".6rem" }}>
                        {practicePurchase.deactivation_date ? (
                          moment(practicePurchase.deactivation_date).format(
                            "MMM DD, YYYY"
                          )
                        ) : (
                          <span>Does not expire</span>
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
    </div>
  );
};

export default PracticePurchasesForUser;
