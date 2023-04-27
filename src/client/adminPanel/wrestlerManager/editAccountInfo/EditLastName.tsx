import * as React from "react";
import { useState, useEffect } from "react";

const EditLastName = (props: IProps) => {
  const [lastName, setLastName] = useState<string | null>(props.lastName);
  const [showUpdateLastName, setShowUpdateLastName] = useState<boolean>(false);

  let handleShowUpdateLastName = () => {
    setShowUpdateLastName(!showUpdateLastName);
  };
  let handleInputChange = (e: any) => {
    setLastName(e.target.value);
  };
  let handleSubmit = () => {
    if (!lastName || lastName.length === 0) {
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
        lastName,
      }),
    };
    fetch("/api/personal_info/updateLastName", requestOptions)
      .then((res) => res.json())
      .then((res) => {
        alert(res.message);
        setShowUpdateLastName(false);
        props.renderFunc();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {showUpdateLastName && (
        <>
          <input
            onChange={handleInputChange}
            style={{ maxWidth: "9rem" }}
            autoFocus
            type="text"
            value={lastName ? lastName : ""}
          />
          {lastName && lastName.length > 0 && lastName !== props.lastName && (
            <button onClick={handleSubmit} className="btn btn-sm btn-success">
              Update last name
            </button>
          )}
        </>
      )}
      {!showUpdateLastName && (
        <button
          style={{ border: "none", color: "blue" }}
          onClick={handleShowUpdateLastName}
          className="btn btn-sm btn-link p-0"
        >
          {lastName ? lastName : "N/A"}
        </button>
      )}
    </>
  );
};

export default EditLastName;
interface IProps {
  userId: number;
  lastName: string | null;
  renderFunc: Function;
}
