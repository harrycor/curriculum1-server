import * as React from "react";
import { useState, useEffect } from "react";
import WarZoneIdFetchFromNameInput from "../../../reusableComponents/WarZoneIdFetchFromNameInput";

const EditWZId = (props: IProps) => {
  const [showUpdateWZId, setShowUpdateWZId] = useState<boolean>(false);
  const [newWarZoneId, setNewWarZoneId] = useState<number>();

  let handleShowUpdateWZId = () => {
    setShowUpdateWZId(!showUpdateWZId);
  };

  let newWarZoneIdInputChange = (wrestler: { id: number; name: string }) => {
    console.log({ newWarzoneInput: wrestler.id });
    setNewWarZoneId(wrestler.id);
  };

  let changeWarZoneIdFunction = () => {
    let token = localStorage.getItem("token");

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: props.userId,
        newWarZoneId,
      }),
    };
    fetch(`/api/users/resetWarZoneIdFromAdmin`, requestOptions).then((res) => {
      if (res.ok) {
        alert(`WAR number reset`);
        // we should not be doing it this way, but I decided to keep it consistent
        // window.location.reload();
        props.renderFunc();
        setShowUpdateWZId(false);
      } else {
        alert("something went wrong");
        // we should not be doing it this way, but I decided to keep it consistent
        // window.location.reload();
        props.renderFunc();
        setShowUpdateWZId(false);
      }
    });
  };

  return (
    <>
      {!showUpdateWZId && (
        <button
          onClick={handleShowUpdateWZId}
          style={{ color: "blue", border: "none" }}
          className="btn btn-sm btn-link"
        >
          {props.warId ? props.warId : "N/A"}
        </button>
      )}
      {showUpdateWZId && (
        <>
          <WarZoneIdFetchFromNameInput
            setStateFunction={newWarZoneIdInputChange}
          />
          {newWarZoneId !== undefined && newWarZoneId > 0 && (
            <button
              onClick={changeWarZoneIdFunction}
              className="btn btn-sm btn-success p-0"
            >
              change WAR Zone Id
            </button>
          )}
        </>
      )}
    </>
  );
};

export default EditWZId;
interface IProps {
  userId: number;
  warId: number | null | undefined;
  renderFunc: Function;
}
