import * as React from "react";
import { useState, useEffect } from "react";

const EditEmail = (props: IProps) => {
  const [email, setEmail] = useState<string | null>(props.email);
  const [showUpdateEmail, setShowUpdateEmail] = useState<boolean>(false);

  let handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  let handleShowUpdateEmail = () => {
    setShowUpdateEmail(!showUpdateEmail);
  };

  let handleSubmit = () => {
    if (!email || email.length === 0) {
      alert("You must enter a new email");
      return;
    } else {
      if (confirm(`Are you sure you want to reset the username?`)) {
        let token = localStorage.getItem("token");
        const requestOptions = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: props.userId,
            email,
          }),
        };
        fetch(`/api/users/resetEmailFromAdmin`, requestOptions)
          .then((res) => res.json())
          .then((res) => {
            alert(res.message);
            setShowUpdateEmail(false);
            props.renderFunc();
          })
          .catch((err) => console.log(err));
      }
    }
  };

  return (
    <>
      {showUpdateEmail && (
        <>
          <input
            autoFocus
            type="email"
            value={email ? email : ""}
            onChange={handleEmailChange}
          />
          {email && email.length > 0 && email !== props.email && (
            <button onClick={handleSubmit} className="btn btn-sm btn-success">
              Update username
            </button>
          )}
        </>
      )}
      {!showUpdateEmail && (
        <button
          onClick={handleShowUpdateEmail}
          style={{ border: "none", color: "blue" }}
          className="btn btn-sm btn-link p-0"
        >
          {email}
        </button>
      )}
    </>
  );
};

export default EditEmail;

interface IProps {
  userId: number;
  email: string;
  renderFunc: Function;
}
