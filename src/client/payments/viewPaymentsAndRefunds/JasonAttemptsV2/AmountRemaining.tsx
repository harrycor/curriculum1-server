import React, { useEffect, useState } from "react";
import { ITransaction } from "../../../../types";

export default function AmountRemaining(props: IProps) {
  const [amountRemaining, setAmountRemaining] = useState<number | string>(
    "loading..."
  );
  useEffect(() => {
    if (props.purchaseId) {
      fetch(
        `/api/transactions/allTransactionsForPurchaseId/${props.purchaseId}`
      )
        .then((res) => {
          return res.json();
        })
        .then((result: ITransaction[]) => {
          console.log({ result });
          let counter = 0;
          for (let x = 0; x < result.length; x++) {
            const transaction = result[x];

            counter = counter + transaction.credit - transaction.debit;
          }
          setAmountRemaining(counter);
        });
    }
  }, [props.purchaseId]);

  return <>{amountRemaining >= 0 ? amountRemaining : "N/A"}</>;
}

interface IProps {
  purchaseId: number;
}
