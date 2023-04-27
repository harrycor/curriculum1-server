import React, { useState, useEffect } from "react";
import { IActiveRecurringPaymentContractsWithUnit } from "../../../../types";
import CancelRecurringPaymentContract from "./CancelRecurringPaymentContract";
import moment from "moment";

const ManageRecurringPaymentContracts = (props: IProps) => {
  const [allRecurringPaymentContracts, setAllRecurringPaymentContracts] =
    useState<IActiveRecurringPaymentContractsWithUnit[]>();
  const [renderBool, setRenderBool] = useState<boolean>(false);
  let token = localStorage.getItem("token");

  useEffect(() => {
    if (props.userId === undefined || props.admin === undefined) return;
    if (props.admin === true) {
      if (props.userId) {
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: props.userId,
          }),
        };
        fetch(
          `/api/recurringPaymentContracts/getAllActiveRecurringPaymentsContractsForUser`,
          requestOptions
        )
          .then((res) => res.json())
          .then((res) => setAllRecurringPaymentContracts(res))
          .catch((err) => console.log(err));
      } else {
        const requestOptions2 = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        fetch(
          `/api/recurringPaymentContracts/getAllActiveRecurringPaymentsContractsForTenant`,
          requestOptions2
        )
          .then((res) => res.json())
          .then((res) => setAllRecurringPaymentContracts(res))
          .catch((err) => console.log(err));
      }
    } else if (props.userId && props.admin === false) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: props.userId,
        }),
      };
      fetch(
        `/api/recurringPaymentContracts/getAllActiveRecurringPaymentsContractsForUser`,
        requestOptions
      )
        .then((res) => res.json())
        .then((res) => setAllRecurringPaymentContracts(res))
        .catch((err) => console.log(err));
    }
  }, [props.userId, props.admin, renderBool]);

  let renderFunc = () => setRenderBool(!renderBool);
  if (allRecurringPaymentContracts) {
    return (
      <div className="d-flex justify-content-center">
        {allRecurringPaymentContracts.length > 0 ? (
          <div className="col-md-10 col-12 d-flex justify-content-center flex-wrap">
            <span style={{ fontSize: "1.4rem" }} className="col-12 text-center">
              <strong>Subscriptions</strong>
            </span>
            <table className="table table-striped">
              <thead>
                <tr>
                  {props.admin && (
                    <>
                      <th>User Id</th>
                      <th>Wrestler</th>
                    </>
                  )}
                  <th>Name of service</th>
                  <th>Purchased on</th>
                  <th>Most recent payment</th>
                  <th>Next payment date</th>
                  <th>Billed every</th>
                  <th>Total</th>
                  <th>Cancel</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: ".8rem" }}>
                {allRecurringPaymentContracts?.map((contract) => {
                  return (
                    <tr key={contract.id}>
                      {props.admin && (
                        <>
                          <td>{contract.user_id}</td>
                          <td>
                            {contract.first_name && contract.last_name
                              ? `${contract.first_name} ${contract.last_name}`
                              : "N/A"}
                          </td>
                        </>
                      )}
                      <td>{contract.name_of_item}</td>
                      <td>
                        {moment(contract.contract_start_date).format(
                          "MMM DD, YYYY"
                        )}
                      </td>
                      <td>
                        {moment(contract.most_recent_payment_date).format(
                          "MMM DD, YYYY"
                        )}
                      </td>
                      <td>
                        {moment(contract.next_payment_date).format(
                          "MMM DD, YYYY"
                        )}
                      </td>
                      <td>
                        {contract.number_of_date_units_for_expiration}{" "}
                        {contract.number_of_date_units_for_expiration > 1
                          ? contract.unit
                          : contract.unit.split("s")[0]}
                      </td>
                      <td>
                        $
                        {contract.total_price_of_service_or_merchandise.toFixed(
                          2
                        )}
                      </td>
                      <td>
                        <CancelRecurringPaymentContract
                          contractId={contract.id}
                          renderFunc={renderFunc}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">
            <span>You have no subscriptions</span>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <span>Loading...</span>
      </div>
    );
  }
};

export default ManageRecurringPaymentContracts;

interface IProps {
  userId: number | null;
  admin: boolean;
}
