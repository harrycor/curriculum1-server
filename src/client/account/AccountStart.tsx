import * as React from "react";
import { useState, useEffect } from "react";
import NavigationBar from "../NavigationBar";
import AccountTenantStripeCheck from "./manageAndViewAccountDetails/AccountTenantStripeCheck";
import EditAccountInfo from "./manageAndViewAccountDetails/editAccountInfo/EditAccountInfo";

const AccountStart = () => {
  const [userId, setUserId] = useState<number>();
  const [userRole, setUserRole] = useState<string>();
  let token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/users/getUserIdAndRoleFromToken`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        isMounted && setUserId(res.userId);
        isMounted && setUserRole(res.role);
      })
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={{ marginBottom: "6rem" }}>
      <div>
        <NavigationBar />
      </div>
      <div>
        {userId && userRole && (
          <>
            <EditAccountInfo />
            <AccountTenantStripeCheck userId={userId} userRole={userRole} />
          </>
        )}
      </div>
    </div>
  );
};

export default AccountStart;
