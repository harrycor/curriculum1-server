import * as React from "react";
import { useState, useEffect } from "react";

const EditFirstName = (props: IProps) => {
  const [firstName, setFirstName] = useState<string | null>(props.firstName);
  const [showUpdateFirstName, setShowUpdateFirstName] =
    useState<boolean>(false);

  let handleShowUpdateFirstName = () => {
    setShowUpdateFirstName(!showUpdateFirstName);
  };
  let handleInputChange = (e: any) => {
    setFirstName(e.target.value);
  };
  let handleSubmit = () => {
    if (!firstName || firstName.length === 0) {
      alert("add a name");
      return;
    }
    let token = localStorage.getItem("token");
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: props.userId,
        firstName,
      }),
    };
    fetch("/api/personal_info/updateFirstName", requestOptions)
      .then((res) => res.json())
      .then((res) => {
        alert(res.message);
        setShowUpdateFirstName(false);
        props.renderFunc();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {showUpdateFirstName && (
        <>
          <input
            onChange={handleInputChange}
            style={{ maxWidth: "9rem" }}
            autoFocus
            type="text"
            value={firstName ? firstName : ""}
          />
          {firstName &&
            firstName.length > 0 &&
            firstName !== props.firstName && (
              <button onClick={handleSubmit} className="btn btn-sm btn-success">
                Update first name
              </button>
            )}
        </>
      )}
      {!showUpdateFirstName && (
        <button
          style={{ border: "none", color: "blue" }}
          onClick={handleShowUpdateFirstName}
          className="btn btn-sm btn-link p-0"
        >
          {firstName ? firstName : "N/A"}
        </button>
      )}
    </>
  );
};

export default EditFirstName;

interface IProps {
  userId: number;
  firstName: string | null;
  renderFunc: Function;
}
