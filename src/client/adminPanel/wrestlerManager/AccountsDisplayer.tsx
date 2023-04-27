import React, { useState, useEffect } from "react";
import { IAccount } from "../../../types";
import EditAccountRow from "./editAccountInfo/EditAccountRow";

export default function AccountsDisplayer(props: IProps) {
  const [allAccounts, setAllAccounts] = useState<IAccount[]>();

  useEffect(() => {
    let token = localStorage.getItem("token");
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch("/api/users/getAllAccountsInTenantForAdmin", requestOptions)
      .then((res) => res.json())
      .then((res) => setAllAccounts(res))
      .catch((err) => console.log(err));
  }, [props.renderBool]);

  return (
    <div className="">
      {allAccounts && (
        <table className="table table-striped">
          <thead
            className="sticky-top"
            style={{
              backgroundColor: "white",
              fontSize: ".8rem",
              // position: "relative", this prevents sticky top
              zIndex: 5,
            }}
          >
            <tr>
              <th>Id</th>
              <th>First name</th>
              <th>Last name</th>
              <th>Real email</th>
              <th>Username</th>
              <th>Phone</th>
              <th>On do not text list</th>
              <th>WAR Id</th>
              <th>Role</th>
              <th>Reset Password</th>
              <th>Account Status</th>
            </tr>
          </thead>
          <tbody>
            {allAccounts?.map((account: IAccount) => {
              return (
                <tr key={account.id}>
                  <EditAccountRow
                    renderBoolFunc={props.renderBoolFunc}
                    account={account}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

interface IProps {
  renderBoolFunc: Function;
  renderBool: boolean;
}
