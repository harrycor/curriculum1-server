import * as React from "react";
import { useState, useEffect } from "react";

const EditPhoneNumber = (props: IProps) => {
  const [phoneNumber, setPhoneNumber] = useState<number | null | string>(
    props.phoneNumber === undefined ? null : props.phoneNumber
  );
  const [showUpdatePhoneNumber, setShowUpdatePhoneNumber] =
    useState<boolean>(false);

  let handlePhoneNumberChange = (e: any) => {
    setPhoneNumber(e.target.value);
  };

  let handleShowUpdatePhoneNumber = () => {
    setShowUpdatePhoneNumber(!showUpdatePhoneNumber);
  };

  // Phone Number Validation
  function convertPhoneNumber(number: string) {
    let formattedNumber = number.replace(/[^\d\+]/g, "");
    return formattedNumber;
  }

  function validatePhoneNumber(input_str: string) {
    var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

    return re.test(input_str);
  }

  let handleSubmit = () => {
    if (!phoneNumber) {
      alert("enter a phone number");
      return;
    }
    if (!validatePhoneNumber(String(phoneNumber))) {
      // WC's func here; did want to change things there
      alert("Phone number not updated. Make sure number is correct format");
      return;
    }
    let newPhoneNumber = convertPhoneNumber(String(phoneNumber));
    let token = localStorage.getItem("token");
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: props.userId,
        newPhoneNumber,
      }),
    };
    fetch(`/api/users/resetPhoneNumberFromAdminOrUser`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        alert(res.message);
        setShowUpdatePhoneNumber(false);
        props.renderFunc();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {showUpdatePhoneNumber && (
        <>
          <input
            style={{ maxWidth: "9rem" }}
            autoFocus
            type="number"
            value={phoneNumber ? phoneNumber : ""}
            onChange={handlePhoneNumberChange}
          />
          {phoneNumber &&
            phoneNumber > 0 &&
            phoneNumber !== props.phoneNumber && (
              <button onClick={handleSubmit} className="btn btn-sm btn-success">
                Update phone number
              </button>
            )}
        </>
      )}
      {!showUpdatePhoneNumber && (
        <button
          onClick={handleShowUpdatePhoneNumber}
          style={{ border: "none", color: "blue" }}
          className="btn btn-sm btn-link p-0"
        >
          {phoneNumber ? phoneNumber : "N/A"}
        </button>
      )}
    </>
  );
};

export default EditPhoneNumber;

interface IProps {
  userId: number;
  phoneNumber: number | null | undefined | string;
  renderFunc: Function;
}
