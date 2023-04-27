import * as React from "react";
import { useState, useEffect } from "react";

const EditRealEmail = (props: IProps) => {
  const [realEmail, setRealEmail] = useState<string | null>(
    props.realEmail === undefined ? null : props.realEmail
  );
  const [showUpdateRealEmail, setShowUpdateRealEmail] =
    useState<boolean>(false);

  let handleRealEmailChange = (e: any) => {
    setRealEmail(e.target.value);
  };

  let handleShowUpdateRealEmail = () => {
    setShowUpdateRealEmail(!showUpdateRealEmail);
  };

  let handleSubmit = () => {
    let token = localStorage.getItem("token");
    let requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: props.userId,
        realEmail,
      }),
    };
    fetch("/api/users/updateRealEmail", requestOptions)
      .then((res) => res.json())
      .then((res) => {
        alert(res.message);
        props.renderFunc();
        setShowUpdateRealEmail(false);
        props.renderFunc();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {showUpdateRealEmail && (
        <>
          <input
            autoFocus
            type="email"
            value={realEmail ? realEmail : ""}
            onChange={handleRealEmailChange}
          />
          {realEmail &&
            realEmail.length > 0 &&
            realEmail !== props.realEmail && (
              <button onClick={handleSubmit} className="btn btn-sm btn-success">
                Update email
              </button>
            )}
        </>
      )}
      {!showUpdateRealEmail && (
        <button
          onClick={handleShowUpdateRealEmail}
          style={{ border: "none", color: "blue" }}
          className="btn btn-sm btn-link p-0"
        >
          {realEmail ? realEmail : "N/A"}
        </button>
      )}
    </>
  );
};

export default EditRealEmail;

interface IProps {
  userId: number;
  realEmail: string | null | undefined;
  renderFunc: Function;
}
