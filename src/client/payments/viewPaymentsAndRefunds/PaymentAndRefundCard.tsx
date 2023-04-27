import * as React from "react";
import { useState, useEffect } from "react";
import { IPaymentsAndPurchases } from "../interfacesForPayments";
import moment from "moment";
import { IPurchase } from "../../../types";
import AmountRemaining from "./JasonAttemptsV2/AmountRemaining";

const PaymentAndRefundCard = (props: IProps) => {
  const [purchaseDetails, setPurchaseDetails] = useState<IPurchase[]>([]);

  useEffect(() => {
    //get purchase details (from paymentsId)
    if (props.paymentId) {
      fetch(`/api/purchases/purchasesForPaymentId/${props.paymentId}`)
        .then((res) => {
          return res.json();
        })
        .then((result) => {
          setPurchaseDetails(result);
        });
    }
  }, [props.paymentId]);

  return (
    <>
      <td>{props.paymentId}</td>
      <td>
        {" "}
        <div
          style={{
            maxHeight: "30rem",
            minHeight: `${window.innerHeight < 600 ? "300px" : "0px"}`,
            overflow: "scroll",
          }}
        >
          <table
            className="table table-striped table-info"
            style={{ fontSize: ".8rem" }}
          >
            <thead
              className="sticky-top"
              style={{ zIndex: 1000, backgroundColor: "rgb(156, 232, 255)" }}
            >
              <tr>
                <th className="col-2 pt-1">Purchase Id</th>
                <th className="col-6 pt-1">Name of item</th>
                <th className="col-2 pt-1">Number of items included</th>
                <th className="col-2 pt-1">Remaining</th>
                <th className="col-2 pt-1">Amount paid</th>
                <th className="col-2 pt-1">Recurring Id</th>
              </tr>
            </thead>
            <tbody>
              {purchaseDetails.map((purchase, index) => {
                return (
                  <tr
                    key={`purchases-details-table-${index}`}
                    // style={{
                    //   backgroundColor: `${
                    //     purchase.number_of_items_remaining === 0 && "#00d0007d"
                    //   }`,
                    // }}
                  >
                    <td>{purchase.id}</td>
                    <td>{purchase.name_of_item}</td>
                    <td>{purchase.number_of_items_included}</td>
                    {/* <td>{purchase.number_of_items_remaining}</td> */}
                    <td>
                      <AmountRemaining purchaseId={purchase.id} />
                    </td>
                    <td>$ {purchase.total_price_of_service_or_merchandise}</td>
                    <td>
                      {purchase.recurring_payment_contracts_id
                        ? purchase.recurring_payment_contracts_id
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </td>
      <td>{moment(props.paymentDate).format("MMM DD, YYYY")}</td>
    </>
  );
};

export default PaymentAndRefundCard;

interface IProps {
  paymentId: number;
  paymentDate: string;
}
