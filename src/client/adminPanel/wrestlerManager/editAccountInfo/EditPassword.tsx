import * as React from "react";
import { useState, useEffect } from "react";

const EditPassword = (props: IProps) => {
  const [showPasswordInput, setShowPasswordInput] = useState<boolean>(false);
  const [password, setPassword] = useState<string>();

  let handleShowPasswordInput = () => {
    setShowPasswordInput(!showPasswordInput);
  };

  let handleInputChange = (e: any) => {
    setPassword(e.target.value);
  };

  let handleResetPassword = () => {
    if (!password || password.length < 1) {
      alert("Need password");
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
        password,
      }),
    };
    fetch("/api/users/resetPasswordFromAdminOrUser", requestOptions)
      .then((res) => res.json())
      .then((res) => {
        alert(res.message);
        setShowPasswordInput(false);
        props.renderFunc();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {!showPasswordInput && (
        <button
          onClick={handleShowPasswordInput}
          style={{ color: "blue" }}
          className="btn btn-sm btn-link p-0"
        >
          Reset
        </button>
      )}
      {showPasswordInput && (
        <>
          <input autoFocus onChange={handleInputChange} type="password" />
          {password && password.length > 0 && (
            <button
              onClick={handleResetPassword}
              className="btn btn-sm btn-success"
            >
              Reset
            </button>
          )}
        </>
      )}
    </>
  );
};

export default EditPassword;
interface IProps {
  userId: number;
  renderFunc: Function;
}
