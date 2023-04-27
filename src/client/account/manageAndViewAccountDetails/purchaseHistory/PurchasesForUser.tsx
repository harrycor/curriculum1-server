import moment from "moment";
import * as React from "react";
import { useState, useEffect } from "react";
import PrivateLessonPurchasesForUser from "./PrivateLessonPurchasesForUser";
import PracticePurchasesForUser from "./PracticePurchasesForUser";

const PurchasesForUser = (props: IProps) => {
  const [showPrivateLessons, setShowPrivateLessons] = useState<boolean>(false);
  const [showPractices, setShowPractices] = useState<boolean>(false);
  let token = localStorage.getItem("token");

  let handleShowPrivateLessons = () => {
    setShowPractices(false);
    setShowPrivateLessons(!showPrivateLessons);
  };
  let handleShowPractices = () => {
    setShowPrivateLessons(false);
    setShowPractices(!showPractices);
  };

  return (
    <div>
      <div className="d-flex justify-content-center text-center m-2">
        <span style={{ fontSize: "1.3rem" }}>
          <strong>Purchase history</strong>
        </span>
      </div>
      <div className="d-flex justify-content-center">
        <button
          style={{
            color: "blue",
            textDecoration: `${showPrivateLessons ? "underline" : "none"}`,
          }}
          onClick={handleShowPrivateLessons}
          className={`m-1 btn btn-sm ${
            showPrivateLessons ? "btn-outline-info" : "btn-link"
          }`}
        >
          Private lessons
        </button>
        <button
          style={{
            color: "blue",
            textDecoration: `${showPractices ? "underline" : "none"}`,
          }}
          onClick={handleShowPractices}
          className={`m-1 btn btn-sm ${
            showPractices ? "btn-outline-info" : "btn-link"
          }`}
        >
          Practices
        </button>
      </div>
      {showPrivateLessons && (
        <div>
          <PrivateLessonPurchasesForUser />
        </div>
      )}
      {showPractices && (
        <div>
          <PracticePurchasesForUser />
        </div>
      )}
    </div>
  );
};

export default PurchasesForUser;

interface IProps {
  userId: number;
}
