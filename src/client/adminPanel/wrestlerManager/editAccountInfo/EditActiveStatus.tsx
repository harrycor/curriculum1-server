import * as React from "react";
import { useState, useEffect } from "react";

const EditActiveStatus = (props: IProps) => {
  let activateUser = () => {
    if (confirm(`Are your sure you want to ACTIVATE user?`)) {
      let token = localStorage.getItem("token");
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      fetch(`/api/users/activateUser/${props.userId}`, requestOptions)
        .then((res) => res.json())
        .then((res) => {
          alert(res.message);
          props.renderFunc();
        })
        .catch((err) => console.log(err));
    }
  };

  let deactivateUser = () => {
    if (confirm(`Are your sure you want to DEACTIVATE user?`)) {
      let token = localStorage.getItem("token");
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      fetch(`/api/users/deactivateUser/${props.userId}`, requestOptions)
        .then((res) => res.json())
        .then((res) => {
          alert(res.message);
          props.renderFunc();
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      {props.isActive === 1 ? (
        <button onClick={deactivateUser} className="btn btn-sm btn-danger">
          Deactivate account
        </button>
      ) : (
        <button onClick={activateUser} className="btn btn-sm btn-success">
          Activate account
        </button>
      )}
    </>
  );
};

export default EditActiveStatus;
interface IProps {
  userId: number;
  isActive: number;
  renderFunc: Function;
}
