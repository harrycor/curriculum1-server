import * as React from "react";
import { useState, useEffect } from "react";
import moment from "moment";
import * as date from "../../services/dateAndTimeFunctions";
import { IPaymentsAndPurchasesForMultiUsers } from "../interfacesForPayments";
import PaymentAndRefundCard from "./PaymentAndRefundCard";
import ManageRecurringPaymentContracts from "../../account/manageAndViewAccountDetails/recurringPaymentContracts/ManageRecurringPaymentContracts";

const ViewAllPaymentsAndRefunds = (props: IProps) => {
  const [allPaymentsAndRefunds, setAllPaymentsAndRefunds] =
    useState<IPaymentWithNameOnTenant[]>();
  const [searchDateFrom, setSearchDateFrom] = useState<string>();
  const [searchDateTo, setSearchDateTo] = useState<string>();
  const [dateRangeSelectedForDisplay, setDateRangeSelectedForDisplay] =
    useState<string>();
  const [showRecurringPaymentContracts, setShowRecurringPaymentContracts] =
    useState<boolean>(false);
  let token = localStorage.getItem("token");

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
      let dateRange = `${moment(searchDateFrom).format(
        "MMM DD, YYYY"
      )} - ${moment(searchDateTo).format("MMM DD, YYYY")}`;
      let dateFrom =
        date.createMomentDateStartOfDayFromDateOnly(searchDateFrom);
      let dateTo = date.createMomentDateEndOfDayFromDateOnly(searchDateTo);
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dateFrom,
          dateTo,
        }),
      };
      fetch(
        `/api/payments/getAllPaymentsForAllInTenantWithInTimeFrame`,
        requestOptions
      )
        .then((res) => res.ok && res.json())
        .then((res) => {
          if (isMounted) {
            setDateRangeSelectedForDisplay(dateRange);
            setAllPaymentsAndRefunds(res);
            console.log({ res });
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

  let handleShowRecurringPaymentContract = () => {
    setShowRecurringPaymentContracts(!showRecurringPaymentContracts);
  };

  return (
    <div>
      <div>
        <button
          onClick={handleShowRecurringPaymentContract}
          className="btn btn-sm btn-info"
        >
          {showRecurringPaymentContracts
            ? "Purchases"
            : "Current recurring payment contracts"}
        </button>
      </div>
      {!showRecurringPaymentContracts && (
        <>
          <div>
            <div className="col-12 ">
              {/* <span style={{ fontSize: ".8rem" }}>search</span> */}
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
          <div>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Wrestler</th>
                  <th>Payment Id</th>
                  <th>Purchases</th>
                </tr>
              </thead>
              <tbody>
                {allPaymentsAndRefunds?.map((payment) => {
                  return (
                    <tr key={payment.id}>
                      <td>
                        {payment.first_name} {payment.last_name}
                      </td>

                      <PaymentAndRefundCard
                        paymentId={payment.id}
                        paymentDate={payment.purchase_date}
                      />

                      {/*<td> <div>
                          <table className="table table-striped">
                            <thead
                              className="sticky-top"
                              style={{ backgroundColor: "white" }}
                            >
                              <tr>
                                <th>Payments Id</th>
                                <th>Purchases</th>
                                <th>Purchase date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {wrestler.purchasesAndPaymentsMade.map(
                                (payment) => {
                                  return (
                                    <tr
                                      key={`payments-header-${payment.paymentsId}`}
                                    >
                                      <PaymentAndRefundCard
                                        paymentDetails={payment}
                                      />
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </table>
                        </div> </td>*/}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {showRecurringPaymentContracts && (
        <ManageRecurringPaymentContracts userId={null} admin={true} />
      )}
    </div>
  );
};

export default ViewAllPaymentsAndRefunds;
interface IProps {}

interface IPaymentWithNameOnTenant {
  id: number;
  user_id: number;
  stripe_event_id: number | null;
  stripe_payment_intents_id: number | null;
  connect_account_id: number;
  charge_status: "succeeded" | "failed" | "cash" | "pending";
  date_created: Date;
  stripe_charge_id: number | null;
  admin_insert_by_user_id: number | null;
  purchase_date: string;
  tenant: number;
  first_name: string;
  last_name: string;
}
