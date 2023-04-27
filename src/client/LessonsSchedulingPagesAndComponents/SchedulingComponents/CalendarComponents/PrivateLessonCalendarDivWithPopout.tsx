import * as React from "react";
import { useState, useEffect } from "react";
import * as dateTimeHandlingFunctions from "../../ServicesForPrivateLessonScheduling/dateTimeHandlingFuncs";
import {
  checkInWrestlerForLessonFromCalendar,
  removeCheckinForLessonFromCalendar,
} from "../../../payments/CheckInsServicesAndPaymentsFunctions";
import "./Styles/CalendarWeeklyView.scss";
import { IFullPrivateLessonsSchedule } from "../../ServicesForPrivateLessonScheduling/interfaces";
import moment from "moment";

const PrivateLessonCalendarDivWithPopout = (props: IProps) => {
  let [privateLessonsSlotBgColor, setPrivateLessonsSlotBgColor] =
    useState<string>();
  let [divTextColor, setDivTextColor] = useState<string>("black");
  let [seriesBGColor, setSeriesBGColor] = useState<string>();
  let [popupDivDisplay, setPopupDivDisplay] = useState<string>("none");
  let [zIndexForPopus, setZIndexForPopus] = useState<any>("0");
  let token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;
    setPrivateLessonsSlotBgColor(
      props.privateLesson.hasLessonBeenUsed ? "#a7f7a7" : "limegreen"
    );
    setSeriesBGColor(
      props.privateLesson.hasLessonBeenUsed ? "#ffa98a" : "coral"
    );
    return () => {
      isMounted = false;
    };
  }, [props.privateLesson.hasLessonBeenUsed]);

  let mouseEnteredDiv = () => {
    handlePopupDiv(true);
  };

  let mouseExitedDiv = () => {
    handlePopupDiv(false);
  };

  let showOrHidePopupDiv = () => {
    if (popupDivDisplay === "none") {
      handlePopupDiv(true);
    } else {
      handlePopupDiv(false);
    }
  };

  let handlePopupDiv = (isHidden: boolean) => {
    if (isHidden) {
      setDivTextColor("white");
      setSeriesBGColor("darkblue");
      setPrivateLessonsSlotBgColor("darkblue");
      setPopupDivDisplay("block");
      setZIndexForPopus("3");
    } else {
      setDivTextColor("black");
      setSeriesBGColor(
        props.privateLesson.hasLessonBeenUsed ? "#ffa98a" : "coral"
      );
      setPrivateLessonsSlotBgColor(
        props.privateLesson.hasLessonBeenUsed ? "#a7f7a7" : "limegreen"
      );
      setPopupDivDisplay("none");
      setZIndexForPopus("0");
    }
  };

  let handleCancelIndividualLesson = (e: any) => {
    e.preventDefault();
    let privateLessonId: string | number = e.target.value;
    let areYouSure = confirm(
      "Are you sure you want to delete this private lesson? This action cannot be undone."
    );
    if (areYouSure) {
      fetch(
        `/api/schedulingLessons/deleteIndividualPrivateLesson/${privateLessonId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          alert(res.message);
          props.boolUsedOnlyToReRenderComponentFunc();
        })
        .catch((err) => console.log(err));
    } else {
      return;
    }
  };

  let handleCancelSeries = (e: any) => {
    e.preventDefault();
    let seriesName = e.target.id;
    let privateLessonId = e.target.value;
    let areYouSure = confirm(
      "Are you sure you want to cancel this series? This will have no affect on any previous lessons within this series"
    );
    if (areYouSure) {
      fetch(
        `/api/schedulingLessons/deletePrivateLessonSeriesMovingForward/${seriesName}/${privateLessonId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          alert(res.message);
          props.boolUsedOnlyToReRenderComponentFunc();
        })
        .catch((err) => console.log(err));
    } else {
      return;
    }
  };

  let handleCheckIn = () => {
    if (
      confirm(`Are you sure you want to check in?\n
    ${props.privateLesson.wrestler_first_name} ${
        props.privateLesson.wrestler_last_name
      }\n
    On: ${moment(props.privateLesson.date_of_lesson.split("T")[0]).format(
      "MMMM, DD, YYYY"
    )}\n
    At: ${dateTimeHandlingFunctions.timeMilitaryToAMPM(
      props.privateLesson.start_time
    )}`)
    ) {
      // check in here
      checkInWrestlerForLessonFromCalendar(
        props.privateLesson.wrestler_user_id,
        props.privateLesson.coaches_user_id,
        props.privateLesson.private_lesson_id,
        `${moment(props.privateLesson.date_of_lesson.split("T")[0]).format(
          "YYYY-MM-DD"
        )}`,
        props.privateLesson.start_time
      ).then((res) => {
        alert(res.message);
        props.boolUsedOnlyToReRenderComponentFunc();
      });
    }
  };

  let handleRemoveCheckIn = async () => {
    if (confirm("Are you sure you want to remove check-in?")) {
      removeCheckinForLessonFromCalendar(
        props.privateLesson.private_lesson_id
      ).then((res) => {
        alert(res.message);
        props.boolUsedOnlyToReRenderComponentFunc();
      });
    }
  };

  return (
    <div
      className="text-center"
      onMouseEnter={mouseEnteredDiv}
      onMouseLeave={mouseExitedDiv}
      onClick={showOrHidePopupDiv}
      style={{
        position: "relative",
        color: divTextColor,
        background: `${
          props.privateLesson.series_name
            ? seriesBGColor
            : privateLessonsSlotBgColor
        }`,
        height: "100%",
        zIndex: zIndexForPopus,
      }}
    >
      <div style={{ overflow: "hidden" }}>
        <span>
          {props.privateLesson.wrestler_first_name}{" "}
          {props.privateLesson.wrestler_last_name} <br />
          {dateTimeHandlingFunctions.timeMilitaryToAMPM(
            props.privateLesson.start_time
          )}
        </span>
        {props.privateLesson.hasLessonBeenUsed && (
          <div
            className="d-flex justify-content-start align-items-end ml-1"
            style={
              {
                // display: "inline",
                // position: "absolute",
                // left: ".6rem",
                // bottom: ".5rem",
              }
            }
          >
            <span style={{ fontSize: "1.5rem" }}>
              *<span style={{ fontSize: ".5rem" }}>Complete</span>
            </span>
          </div>
        )}
      </div>

      <div
        className="text-left popup-div"
        style={{ display: popupDivDisplay }}
        onClick={showOrHidePopupDiv}
      >
        <span>
          {props.privateLesson.wrestler_first_name} <br />
          {props.privateLesson.wrestler_last_name} <br />
          {props.privateLesson.notes ? (
            <div
              style={{
                border: "solid black 1px",
                borderRadius: ".3rem",
                padding: ".1rem",
              }}
            >
              <span>
                <strong style={{ fontSize: ".6rem" }}>
                  notes:
                  <br />
                </strong>
                {props.privateLesson.notes}
              </span>
            </div>
          ) : (
            <div>
              <span>-</span>
              <br />
            </div>
          )}
          <div
            style={{
              fontSize: ".6rem",
              border: "solid black 1px",
              borderRadius: ".3rem",
              whiteSpace: "nowrap",
              marginTop: ".1rem",
              padding: ".1rem",
            }}
          >
            <span>
              <strong>weight:</strong>{" "}
              {props.privateLesson.weight ? props.privateLesson.weight : "-"}
            </span>{" "}
            <br />
            <span>
              <strong>age:</strong>{" "}
              {props.privateLesson.age ? props.privateLesson.age : "-"}
            </span>{" "}
            <br />
            <span>
              <strong>WAR:</strong>{" "}
              {props.privateLesson.WAR ? props.privateLesson.WAR : "-"}
            </span>
          </div>
          {dateTimeHandlingFunctions.timeMilitaryToAMPM(
            props.privateLesson.start_time
          )}{" "}
          <br />
          {/* The split function removes the added time information, so that is is just the date. */}
          {moment(props.privateLesson.date_of_lesson.split("T")[0]).format(
            "MM/DD/YYYY"
          )}
        </span>
        {((props.role === "admin" && !props.privateLesson.hasLessonBeenUsed) ||
          (props.isAdminBoolFromHeader &&
            !props.privateLesson.hasLessonBeenUsed)) && (
          <div style={{ width: "99%" }}>
            <button
              value={props.privateLesson.private_lesson_id}
              onClick={handleCancelIndividualLesson}
              className="single btn-danger ml-1 mr-1 mb-1"
            >
              Cancel lesson
            </button>

            {props.privateLesson.series_name ? (
              <button
                id={props.privateLesson.series_name}
                value={props.privateLesson.private_lesson_id}
                onClick={handleCancelSeries}
                className="series btn-danger ml-1 mr-1 mb-1"
              >
                Cancel series
              </button>
            ) : null}
          </div>
        )}

        {(props.role === "admin" || props.role === "coach") && (
          <div>
            {props.privateLesson.lessonsRemaining !== undefined && (
              <div style={{ backgroundColor: "#d8d8d8", padding: "1px" }}>
                <span className="d-flex align-items-center">
                  <span>
                    <strong>Lessons remaining: </strong>
                  </span>
                  <span
                    style={{
                      backgroundColor: "yellow",
                      padding: ".2rem .5rem",
                      fontSize: "1rem",
                    }}
                  >
                    <strong>{props.privateLesson.lessonsRemaining}</strong>
                  </span>
                </span>
                {props.privateLesson.lessonsRemaining > 0 &&
                  !props.privateLesson.hasLessonBeenUsed && (
                    <button
                      onClick={handleCheckIn}
                      className="btn btn-sm btn-dark col-12 mt-1 mb-1"
                    >
                      Check-in
                    </button>
                  )}
                {props.privateLesson.hasLessonBeenUsed &&
                  props.privateLesson.canCheckInBeRemoved && (
                    <button
                      onClick={handleRemoveCheckIn}
                      className="btn btn-sm btn-secondary"
                    >
                      remove check-in
                    </button>
                  )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateLessonCalendarDivWithPopout;

interface IProps {
  privateLesson: IFullPrivateLessonsSchedule;
  boolUsedOnlyToReRenderComponentFunc: any;
  isAdminBoolFromHeader: boolean;
  role: string | undefined;
}
