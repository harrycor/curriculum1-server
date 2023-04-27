import * as React from "react";
import * as dateTimeHandlingFunctions from "../../ServicesForPrivateLessonScheduling/dateTimeHandlingFuncs";
import { useEffect, useState } from "react";
import {
  IFullPrivateLessonsSchedule,
  IAvailabilityForCoachesId,
} from "../../ServicesForPrivateLessonScheduling/interfaces";
import * as calCssValues from "../../ServicesForPrivateLessonScheduling/CalendarCssValues";
import "./Styles/CalendarWeeklyView.scss";
import PrivateLessonCalendarDivWithPopout from "./PrivateLessonCalendarDivWithPopout";

// you should try to send the coach avail from component instead of running the fetch in here... try it again bukko
// props: IProps
const CoachesPrivateLessonScheduleWeeklyCalendar = (props: IProps) => {
  let [coachesAvailability, setCoachesAvailability] =
    useState<Array<IAvailabilityForCoachesId>>();
  let [coachesWeeklyScheduleForTheWeek, setCoachesWeeklyScheduleForTheWeek] =
    useState<Array<IFullPrivateLessonsSchedule>>(
      props.weeklyPrivateLessonsSchedule
    );
  let marginLeftMultiplyNumber = 0;
  let privateLessonDate: string;
  let privateLessonTime: string;

  useEffect(() => {
    setCoachesWeeklyScheduleForTheWeek(props.weeklyPrivateLessonsSchedule);
    if (
      (props.coachesId > 0 && coachesAvailability === null) ||
      props.coachesId > 0
    ) {
      fetch(
        `/api/schedulingLessons/getCoachesWeeklyAvailibityByCoachesId/${props.coachesId}`
      )
        .then((res) => res.json())
        .then((res) => setCoachesAvailability(res));
    }
  }, [props.coachesId, props.weeklyPrivateLessonsSchedule]);

  let returnsPercentageForLessonSlotWidth = (
    dayOfWeekAsNumber: number | string,
    amountOfTimeOfMatchingTimes: any
  ) => {
    if (Number(dayOfWeekAsNumber) === calCssValues.sunAsNum) {
      //sunday
      return calCssValues.sundaySixWidth / Number(amountOfTimeOfMatchingTimes);
    }
    if (Number(dayOfWeekAsNumber) === calCssValues.monAsNum) {
      //monday
      return calCssValues.mondayZeroWdith / Number(amountOfTimeOfMatchingTimes);
    }
    if (Number(dayOfWeekAsNumber) === calCssValues.tuesAsNum) {
      //tuesday
      return calCssValues.tuesdayOneWidth / Number(amountOfTimeOfMatchingTimes);
    }
    if (Number(dayOfWeekAsNumber) === calCssValues.wedAsNum) {
      //wednesday
      return (
        calCssValues.wednesdayTwoWidth / Number(amountOfTimeOfMatchingTimes)
      );
    }
    if (Number(dayOfWeekAsNumber) === calCssValues.thursAsNum) {
      //thrus
      return (
        calCssValues.thursdayThreeWidth / Number(amountOfTimeOfMatchingTimes)
      );
    }
    if (Number(dayOfWeekAsNumber) === calCssValues.friAsNum) {
      //fri
      return calCssValues.fridayFourWidth / Number(amountOfTimeOfMatchingTimes);
    }
    if (Number(dayOfWeekAsNumber) === calCssValues.satAsNum) {
      //sat
      return (
        calCssValues.SaturdayFiveWidth / Number(amountOfTimeOfMatchingTimes)
      );
    }
  };

  let returnsMarginLeftForPrivateLessonPlacementWithinWeekday = (
    privLessonDateFuncParam: string,
    privLessonTimeFuncParam: string,
    amountOfTimesLessonOccurs: any,
    dayOfWeekAsNum: any
  ) => {
    if (amountOfTimesLessonOccurs === 1) {
      if (dayOfWeekAsNum === calCssValues.sunAsNum) {
        return 0.4;
      } //sunday
      if (dayOfWeekAsNum === calCssValues.monAsNum) {
        return 0.3;
      } //monday
      if (dayOfWeekAsNum === calCssValues.tuesAsNum) {
        return 0.4;
      } //tuesday
      if (dayOfWeekAsNum === calCssValues.wedAsNum) {
        return 0.5;
      } //wednesday
      if (dayOfWeekAsNum === calCssValues.thursAsNum) {
        return 0.9;
      } //thursday
      if (dayOfWeekAsNum === calCssValues.friAsNum) {
        return 1.2;
      } //friday
      return 3.2; //satday
    } else {
      if (
        privLessonDateFuncParam !== privateLessonDate ||
        privLessonTimeFuncParam !== privateLessonTime
      ) {
        marginLeftMultiplyNumber = 0;
        privateLessonDate = privLessonDateFuncParam;
        privateLessonTime = privLessonTimeFuncParam;
        let widthPercentageForWeekdayConfigured: any =
          returnsPercentageForLessonSlotWidth(
            dayOfWeekAsNum,
            amountOfTimesLessonOccurs
          );
        return widthPercentageForWeekdayConfigured * marginLeftMultiplyNumber;
      } else {
        marginLeftMultiplyNumber++;
        let widthPercentageForWeekdayConfigured: any =
          returnsPercentageForLessonSlotWidth(
            dayOfWeekAsNum,
            amountOfTimesLessonOccurs
          );
        return widthPercentageForWeekdayConfigured * marginLeftMultiplyNumber;
      }
    }
  };

  if (
    props.daysOfWeek === undefined ||
    !props.daysOfWeek[0] ||
    !props.coachesId
  ) {
    return <div>Calendar unavailable</div>;
  }

  return (
    <>
      {!coachesWeeklyScheduleForTheWeek && (
        <div
          className="col-12 text-center"
          style={{ zIndex: 2000, position: "sticky", top: "50%" }}
        >
          <span
            className="col-12"
            style={{
              backgroundColor: "white",
              border: "solid black 1px",
              borderRadius: ".3rem",
            }}
          >
            <strong>Loading...</strong>
          </span>
          <div className="col-12 d-flex justify-content-center">
            <div
              style={{
                border: "10px solid #f3f3f3",
                borderTop: "7px solid #3498db",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                animation: "spin 1s linear infinite",
              }}
            ></div>
          </div>
        </div>
      )}
      <div
        className="calendar-container"
        style={{
          opacity: `${!coachesWeeklyScheduleForTheWeek ? "40%" : "100%"}`,
        }}
      >
        <div
          className="header viewingdates-scroll-arrows"
          style={{ zIndex: 2000 }}
        >
          <div
            className="d-flex align-items-center justify-content-center text-center"
            style={{ backgroundColor: "white" }}
          >
            <div className="d-flex flex-wrap justify-content-center">
              <div className="col-12 p-0 d-flex flex-wrap">
                <div className="col-2 p-0">
                  <button
                    disabled={!coachesWeeklyScheduleForTheWeek ? true : false}
                    className="m-0 btn btn-outline-dark left-arrow"
                    onClick={props.handleLeftArrowWeekCycle}
                  >
                    {" "}
                    &larr;
                  </button>
                </div>
                <div className="col-8 p-0 d-flex flex-wrap justify-content-center">
                  <div
                    className="mt-1 col-10"
                    style={{ fontSize: "10px" }}
                    onClick={props.goToTodaysDate}
                  >
                    <button
                      disabled={!coachesWeeklyScheduleForTheWeek ? true : false}
                    >
                      <u>Go to today</u>
                    </button>
                  </div>
                  <div>
                    <p className="p-0 m-0" style={{ fontSize: "12px" }}>
                      {props.weekStartDate} - {props.weekEndDate}
                    </p>
                  </div>
                </div>
                <div className="col-2 p-0">
                  <button
                    disabled={!coachesWeeklyScheduleForTheWeek ? true : false}
                    className="btn btn-outline-dark right-arrow"
                    onClick={props.handleRightArrowWeekCycle}
                  >
                    {" "}
                    &#8594;
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ul
            className="ul-weekly weekdays"
            style={{ margin: "0px", fontSize: "70%" }}
          >
            <li className="li-weekly d-sm-block d-none">Sunday</li>
            <li className="li-weekly d-sm-block d-none">Monday</li>
            <li className="li-weekly d-sm-block d-none">Tuesday</li>
            <li className="li-weekly d-sm-block d-none">Wednesday</li>
            <li className="li-weekly d-sm-block d-none">Thursday</li>
            <li className="li-weekly d-sm-block d-none">Friday</li>
            <li className="li-weekly d-sm-block d-none">Saturday</li>
            <li className="li-weekly d-sm-none d-grid">Sun</li>
            <li className="li-weekly d-sm-none d-grid">Mon</li>
            <li className="li-weekly d-sm-none d-grid">Tue</li>
            <li className="li-weekly d-sm-none d-grid">Wed</li>
            <li className="li-weekly d-sm-none d-grid">Thu</li>
            <li className="li-weekly d-sm-none d-grid">Fri</li>
            <li className="li-weekly d-sm-none d-grid">Sat</li>
          </ul>

          <ul className="ul-weekly daynumbers" style={{ margin: "0px" }}>
            <li className="li-weekly">{props.daysOfWeek[0]}</li>
            <li className="li-weekly">{props.daysOfWeek[1]}</li>
            <li className="li-weekly">{props.daysOfWeek[2]}</li>
            <li className="li-weekly">{props.daysOfWeek[3]}</li>
            <li className="li-weekly">{props.daysOfWeek[4]}</li>
            <li className="li-weekly">{props.daysOfWeek[5]}</li>
            <li className="li-weekly">{props.daysOfWeek[6]}</li>
          </ul>
        </div>

        <div className="timeslots-container">
          <ul className="ul-weekly  timeslots" style={{ margin: "0px" }}>
            <li className="li-weekly">
              12<sup>am</sup>
            </li>
            <li className="li-weekly">
              12:30<sup>am</sup>
            </li>
            <li className="li-weekly">
              1<sup>am</sup>
            </li>
            <li className="li-weekly">
              1:30<sup>am</sup>
            </li>
            <li className="li-weekly">
              2<sup>am</sup>
            </li>
            <li className="li-weekly">
              2:30<sup>am</sup>
            </li>
            <li className="li-weekly">
              3<sup>am</sup>
            </li>
            <li className="li-weekly">
              3:30<sup>am</sup>
            </li>
            <li className="li-weekly">
              4<sup>am</sup>
            </li>
            <li className="li-weekly">
              4:30<sup>am</sup>
            </li>
            <li className="li-weekly">
              5<sup>am</sup>
            </li>
            <li className="li-weekly">
              5:30<sup>am</sup>
            </li>
            <li className="li-weekly">
              6<sup>am</sup>
            </li>
            <li className="li-weekly">
              6:30<sup>am</sup>
            </li>
            <li className="li-weekly">
              7<sup>am</sup>
            </li>
            <li className="li-weekly">
              7:30<sup>am</sup>
            </li>
            <li className="li-weekly">
              8<sup>am</sup>
            </li>
            <li className="li-weekly">
              8:30<sup>am</sup>
            </li>
            <li className="li-weekly">
              9<sup>am</sup>
            </li>
            <li className="li-weekly">
              9:30<sup>am</sup>
            </li>
            <li className="li-weekly">
              10<sup>am</sup>
            </li>
            <li className="li-weekly">
              10:30<sup>am</sup>
            </li>
            <li className="li-weekly">
              11<sup>am</sup>
            </li>
            <li className="li-weekly">
              11:30<sup>am</sup>
            </li>

            <li className="li-weekly">
              12<sup>pm</sup>
            </li>
            <li className="li-weekly">
              12:30<sup>pm</sup>
            </li>
            <li className="li-weekly">
              1<sup>pm</sup>
            </li>
            <li className="li-weekly">
              1:30<sup>pm</sup>
            </li>
            <li className="li-weekly">
              2<sup>pm</sup>
            </li>
            <li className="li-weekly">
              2:30<sup>pm</sup>
            </li>
            <li className="li-weekly">
              3<sup>pm</sup>
            </li>
            <li className="li-weekly">
              3:30<sup>pm</sup>
            </li>
            <li className="li-weekly">
              4<sup>pm</sup>
            </li>
            <li className="li-weekly">
              4:30<sup>pm</sup>
            </li>
            <li className="li-weekly">
              5<sup>pm</sup>
            </li>
            <li className="li-weekly">
              5:30<sup>pm</sup>
            </li>
            <li className="li-weekly">
              6<sup>pm</sup>
            </li>
            <li className="li-weekly">
              6:30<sup>pm</sup>
            </li>
            <li className="li-weekly">
              7<sup>pm</sup>
            </li>
            <li className="li-weekly">
              7:30<sup>pm</sup>
            </li>
            <li className="li-weekly">
              8<sup>pm</sup>
            </li>
            <li className="li-weekly">
              8:30<sup>pm</sup>
            </li>
            <li className="li-weekly">
              9<sup>pm</sup>
            </li>
            <li className="li-weekly">
              9:30<sup>pm</sup>
            </li>
            <li className="li-weekly">
              10<sup>pm</sup>
            </li>
            <li className="li-weekly">
              10:30<sup>pm</sup>
            </li>
            <li className="li-weekly">
              11<sup>pm</sup>
            </li>
            <li className="li-weekly">
              11:30<sup>pm</sup>
            </li>
          </ul>
        </div>

        <div className="event-container">
          <div className="seperator-sun-mon"></div>
          <div className="seperator-mon-tue"></div>
          <div className="seperator-tue-wed"></div>
          <div className="seperator-wed-thurs"></div>
          <div className="seperator-thurs-fri"></div>
          <div className="seperator-fri-sat"></div>

          {!coachesAvailability || !coachesAvailability[0] ? (
            <></>
          ) : (
            coachesAvailability.map((availableDay) => {
              return (
                <div
                  className={`slot all-availability-slots ${availableDay.day_of_week}`}
                  style={{
                    gridRow:
                      dateTimeHandlingFunctions.startTimeValueForStyleSheet(
                        availableDay.start_time
                      ),
                    height: `${dateTimeHandlingFunctions.amountOfTimeInPixelsForStyleSheetHeightCoachesAvailability(
                      availableDay.start_time,
                      availableDay.stop_time,
                      false
                    )}px`,
                  }}
                  key={availableDay.id}
                >
                  <div>
                    <span>
                      {dateTimeHandlingFunctions.timeMilitaryToAMPM(
                        availableDay.start_time
                      )}
                      -
                      {dateTimeHandlingFunctions.timeMilitaryToAMPM(
                        availableDay.stop_time
                      )}
                    </span>
                  </div>
                </div>
              );
            })
          )}

          {!coachesWeeklyScheduleForTheWeek ||
          !coachesWeeklyScheduleForTheWeek[0] ? (
            <></>
          ) : (
            coachesWeeklyScheduleForTheWeek.map((privateLesson) => {
              return (
                <div
                  key={privateLesson.private_lesson_id}
                  className={`slot lesson-slot private-lesson-slot weekday${
                    privateLesson.weekday_as_number
                  } ${privateLesson.series_name ? "series-slot" : ""}`}
                  style={{
                    position: "absolute",
                    zIndex: 1005,
                    gridRow:
                      dateTimeHandlingFunctions.startTimeValueForStyleSheet(
                        privateLesson.start_time
                      ),
                    height: `${dateTimeHandlingFunctions.amountOfTimeInPixelsForStyleSheetHeightCoachesAvailability(
                      privateLesson.start_time,
                      privateLesson.duration,
                      true
                    )}px`,
                    width: `${returnsPercentageForLessonSlotWidth(
                      privateLesson.weekday_as_number,
                      privateLesson.amount_of_times_this_lessons_exact_date_and_time_occur
                    )}%`,
                    marginLeft: `${returnsMarginLeftForPrivateLessonPlacementWithinWeekday(
                      privateLesson.date_of_lesson,
                      privateLesson.start_time,
                      privateLesson.amount_of_times_this_lessons_exact_date_and_time_occur,
                      privateLesson.weekday_as_number
                    )}%`,
                  }}
                >
                  {
                    <PrivateLessonCalendarDivWithPopout
                      privateLesson={privateLesson}
                      boolUsedOnlyToReRenderComponentFunc={
                        props.boolFuncForReRender
                      }
                      isAdminBoolFromHeader={props.isAdminBoolFromHeader}
                      role={props.role}
                    />
                  }
                </div>
              );
            })
          )}
          <div
            className="timeline blueline-marks-time"
            style={{
              gridRow: dateTimeHandlingFunctions.startTimeValueForStyleSheet(
                props.currentTimeForCalendarBlueLine
              ),
              height: "3px",
              backgroundColor: "aqua",
              width: "100%",
              zIndex: 1003,
              position: "absolute",
            }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default CoachesPrivateLessonScheduleWeeklyCalendar;

interface IProps {
  coachesId: number;
  weeklyPrivateLessonsSchedule: IFullPrivateLessonsSchedule[] | any;
  daysOfWeek: string[] | any;
  currentTimeForCalendarBlueLine: any;
  propUsedOnlyForReRender?: boolean;
  boolFuncForReRender: any;
  isAdminBoolFromHeader: boolean;
  weekStartDate: string;
  weekEndDate: string;
  handleLeftArrowWeekCycle: Function | any;
  handleRightArrowWeekCycle: Function | any;
  goToTodaysDate: Function | any;
  role: string | undefined;
}
