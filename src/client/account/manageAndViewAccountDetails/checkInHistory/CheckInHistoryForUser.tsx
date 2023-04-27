import * as React from "react";
import { useState, useEffect } from "react";
import PrivateLessonCheckInHistoryForUser from "./PrivateLessonCheckInHistoryForUser";
import PracticeCheckInHistoryForUser from "./PracticeCheckInHistoryForUser";

const CheckInHistoryForUser = (props: IProps) => {
  const [showPrivateLessonsHistory, setShowPrivateLessonsHistory] =
    useState<boolean>(false);
  const [showPracticesHistory, setShowPracticesHistory] =
    useState<boolean>(false);

  let handleShowPrivateLessons = () => {
    setShowPracticesHistory(false);
    setShowPrivateLessonsHistory(!showPrivateLessonsHistory);
  };
  let handleShowPractices = () => {
    setShowPrivateLessonsHistory(false);
    setShowPracticesHistory(!showPracticesHistory);
  };

  return (
    <div>
      <div className="d-flex justify-content-center text-center m-2">
        <span style={{ fontSize: "1.3rem" }}>
          <strong>Check-in history</strong>
        </span>
      </div>
      <div className="d-flex justify-content-center">
        <button
          style={{
            color: "blue",
            textDecoration: `${
              showPrivateLessonsHistory ? "underline" : "none"
            }`,
          }}
          onClick={handleShowPrivateLessons}
          className={`m-1 btn btn-sm ${
            showPrivateLessonsHistory ? "btn-outline-info" : "btn-link"
          }`}
        >
          Private lessons
        </button>
        <button
          style={{
            color: "blue",
            textDecoration: `${showPracticesHistory ? "underline" : "none"}`,
          }}
          onClick={handleShowPractices}
          className={`m-1 btn btn-sm ${
            showPracticesHistory ? "btn-outline-info" : "btn-link"
          }`}
        >
          Practices
        </button>
      </div>
      <div>
        {showPrivateLessonsHistory && (
          <div>
            <PrivateLessonCheckInHistoryForUser userId={props.userId} />
          </div>
        )}
        {showPracticesHistory && (
          <div>
            <PracticeCheckInHistoryForUser userId={props.userId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInHistoryForUser;

interface IProps {
  userId: number;
}
