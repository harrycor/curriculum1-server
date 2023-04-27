import React, { useEffect, useState } from "react";
import Select from "react-select";
import moment from "moment";

export default function viewPayments() {
  const [allWrestlersInTenant, setAllWrestlersInTenant] = useState<any[]>();
  const [allPaymentsForUser, setAllPaymentsForUser] = useState([]);
  const [userIdToFind, setUserIdToFind] = useState<number>();

  useEffect(() => {
    let isMounted = true;
    let token = localStorage.getItem("token");
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

  useEffect(() => {
    if (!userIdToFind) return;
    getPurchases();
  }, [userIdToFind]);

  let getPurchases = () => {
    fetch(`/api/purchases/purchasesForUser/${userIdToFind}`)
      .then((res) => res.json())
      .then((res) => {
        setAllPaymentsForUser(res);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="col-md-5 col-10">
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
      <table className="table table-striped table-border">
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
      </table>
    </>
  );
}
