import moment from "moment";
import * as React from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import ManageRecurringPaymentContracts from "../../../account/manageAndViewAccountDetails/recurringPaymentContracts/ManageRecurringPaymentContracts";
import * as date from "../../../services/dateAndTimeFunctions";
import { IPaymentsAndPurchases } from "../../interfacesForPayments";
import PaymentAndRefundCard from "../PaymentAndRefundCard";

const ViewPaymentsAndRefundsForWrestlerV2 = (props: IProps) => {
  const [allWrestlersInTenant, setAllWrestlersInTenant] = useState<any[]>();
  const [userIdToFind, setUserIdToFind] = useState<number>();
  const [allPaymentsForUser, setAllPaymentsForUser] = useState<IPayment[]>();
  const [searchDateFrom, setSearchDateFrom] = useState<string>();
  const [searchDateTo, setSearchDateTo] = useState<string>();
  const [dateRangeSelectedForDisplay, setDateRangeSelectedForDisplay] =
    useState<string>();
  const [showRecurringPaymentContracts, setShowRecurringPaymentContracts] =
    useState<boolean>(false);
  let token = localStorage.getItem("token");

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
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch("/api/users/getAllUsersInTenantWithNames", requestOptions)
      .then((res) => res.json())
      .then((res) => isMounted && setAllWrestlersInTenant(res))
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, []);

  let handleWrestlerClicked = (e: {
    id: number;
    first_name: string;
    last_name: string;
  }) => {
    setUserIdToFind(e.id);
  };

  let handleShowRecurringPaymentContracts = () => {
    setShowRecurringPaymentContracts(!showRecurringPaymentContracts);
  };

  useEffect(() => {
    if (!userIdToFind || !searchDateFrom || !searchDateTo) return;
    getPurchases();
  }, [userIdToFind, searchDateFrom, searchDateTo]);

  let getPurchases = () => {
    let dateRange = `${moment(searchDateFrom).format(
      "MMM DD, YYYY"
    )} - ${moment(searchDateTo).format("MMM DD, YYYY")}`;
    let dateFrom = date.createMomentDateStartOfDayFromDateOnly(searchDateFrom);
    let dateTo = date.createMomentDateEndOfDayFromDateOnly(searchDateTo);
    const requestOptions2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        wrestlerId: userIdToFind,
        dateFrom,
        dateTo,
      }),
    };
    fetch(`/api/payments/getAllPaymentsForUserId`, requestOptions2)
      .then((res) => res.json())
      .then((res) => {
        console.log({ res });
        setAllPaymentsForUser(res);
      })
      .catch((err) => console.log(err));
  };

  let handleSearchDateFromChange = (e: any) => {
    setSearchDateFrom(e.target.value);
  };
  let handleSearchDateToChange = (e: any) => {
    setSearchDateTo(e.target.value);
  };

  return (
    <div>
      <>
        <div className="col-md-5 col-10" style={{ zIndex: 1030 }}>
          <Select
            // defaultValue={selectedUserId}
            options={allWrestlersInTenant}
            getOptionLabel={(option) => {
              return `${option.first_name ? option.first_name : "N/A"} ${
                option.last_name ? option.last_name : ""
              }`;
            }}
            getOptionValue={(option) => {
              return `${option.id}`;
            }}
            onChange={handleWrestlerClicked}
          />
        </div>
        <div>
          <button
            onClick={handleShowRecurringPaymentContracts}
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
                  {allPaymentsForUser?.map((payment) => {
                    return (
                      <tr key={`payments-header-${payment.id}`}>
                        <PaymentAndRefundCard
                          paymentId={payment.id}
                          paymentDate={String(payment.purchase_date)}
                        />
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
        {/* <table className="table table-striped table-border">
          <thead>
            <tr>
              <th>Name</th>
              <th>Service</th>
              <th>Date purchased</th>
              
                <th>Amount paid</th>
            </tr>
          </thead>
          <tbody>
            {allPaymentsForUser.map((payment: any) => {
              return (
                <tr>
                  <td>
                    {payment.first_name} {payment.last_name}
                  </td>
                  <td>{payment.name_of_item}</td>
                  <td>{moment(payment.purchase_date).format("MM/DD/YYYY")}</td>
                  <td>{payment.total_price_of_service_or_merchandise}</td>
                </tr>
              );
            })}
          </tbody>
        </table> */}
        {showRecurringPaymentContracts && userIdToFind && (
          <ManageRecurringPaymentContracts userId={userIdToFind} admin={true} />
        )}
      </>
    </div>
  );
};

export default ViewPaymentsAndRefundsForWrestlerV2;
interface IProps {}

interface IPayment {
  id: number;
  user_id: number;
  stripe_event_id: number;
  stripe_payment_intents_id: number;
  connect_account_id: number;
  charge_status: charge_status;
  date_created: Date;
  stripe_charge_id: number;
  admin_insert_by_user_id: number;
  purchase_date: Date;
}

type charge_status = "succeeded" | "failed" | "pending" | "cash";
