import * as React from "react";
import { useState, useEffect } from "react";
import { IAccount } from "../../../../types";
import EditPassword from "../../../adminPanel/wrestlerManager/editAccountInfo/EditPassword";
import EditRealEmail from "../../../adminPanel/wrestlerManager/editAccountInfo/EditRealEmail";
import EditPhoneNumber from "../../../adminPanel/wrestlerManager/editAccountInfo/EditPhoneNumber";
import EditOnDoNotTextList from "../../../adminPanel/wrestlerManager/editAccountInfo/EditOnDoNotTextList";

const EditAccountInfo = (props: IProps) => {
  const [accountInfo, setAccountInfo] = useState<IAccount[]>();
  const [renderBool, setRenderBool] = useState<boolean>(false);

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
    fetch("/api/users/getAccountInfoForUser", requestOptions)
      .then((res) => res.json())
      .then((res) => isMounted && setAccountInfo(res))
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, [renderBool]);

  let renderFunc = () => {
    setRenderBool(!renderBool);
  };

  return (
    <div>
      <div className="col-12 p-0 d-flex flex-wrap justify-content-center text-center">
        {accountInfo &&
          accountInfo[0].first_name &&
          accountInfo[0].last_name && (
            <h5 className="col-12">
              {accountInfo[0].first_name} {accountInfo[0].last_name}
            </h5>
          )}
        <h4 className="col-12">Account information</h4>
        {/* real email phone number do not text onDoNotTextList Password !!
         email = username ** do not give to user */}
        <div style={{ overflow: "scroll" }} className="col-12 d-flex justify-content-centerF">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Password</th>
                <th>Phone number</th>
                {/* <th style={{ fontSize: ".7rem" }}>
                Do not text me about good partner match-ups
              </th> */}
              </tr>
            </thead>
            <tbody>
              {accountInfo?.map((account) => (
                <tr key={account.id}>
                  <td>{account.email}</td>
                  <td>
                    <EditRealEmail
                      userId={account.id}
                      realEmail={account.real_email}
                      renderFunc={renderFunc}
                    />
                  </td>
                  <td>
                    <EditPassword userId={account.id} renderFunc={renderFunc} />
                  </td>
                  <td>
                    <EditPhoneNumber
                      userId={account.id}
                      phoneNumber={account.phone_number}
                      renderFunc={renderFunc}
                    />
                  </td>
                  {/* <td>
                  <EditOnDoNotTextList
                    userId={account.id}
                    onDoNotTextList={account.on_do_not_text_list}
                    renderFunc={renderFunc}
                  />
                </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EditAccountInfo;
interface IProps {}
