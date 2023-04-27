import * as React from "react";
import { useState, useEffect } from "react";

const EditRole = (props: IProps) => {
  const [role, setRole] = useState<string>(props.role);

  useEffect(() => {
    let token = localStorage.getItem("token");
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: props.userId,
        role,
      }),
    };
    if (role === props.role) return;
    console.log("hits");
    fetch("/api/users/updateRole", requestOptions)
      .then((res) => res.json())
      .then((res) => {
        alert(res.message);
        props.renderFunc();
      })
      .catch((err) => console.log(err));
  }, [role]);

  let handleRoleChange = (e: any) => {
    setRole(e.target.value);
  };

  return (
    <>
      <select
        name="role"
        className="mb-2 form-control"
        defaultValue={role}
        onChange={handleRoleChange}
      >
        <option value="wrestler">Wrestler</option>
        <option value="coach">
          Coach (can submit and edit grades of wrestlers)
        </option>
        <option value="admin">
          Admin (can add/delete videos, can register new accounts)
        </option>
      </select>
    </>
  );
};

export default EditRole;
interface IProps {
  userId: number;
  role: string;
  renderFunc: Function;
}
