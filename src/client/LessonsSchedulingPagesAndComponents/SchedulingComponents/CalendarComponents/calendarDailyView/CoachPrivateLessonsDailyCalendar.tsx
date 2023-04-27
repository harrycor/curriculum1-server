import * as React from "react";
import { useState, useEffect } from "react";
import { IDailyScheduleForCoach } from "./CoachesDailyPrivateLessonScheduleHeader";
import "../Styles/CalendarDailyView.scss";
import PrivateLessonCalendarDivWithPopout from "../PrivateLessonCalendarDivWithPopout";
import * as dateTimeHandlingFunctions from "../../../ServicesForPrivateLessonScheduling/dateTimeHandlingFuncs";
import * as calCssValues from "../../../ServicesForPrivateLessonScheduling/CalendarCssValues";
import { IFullPrivateLessonsSchedule } from "../../../ServicesForPrivateLessonScheduling/interfaces";
import moment from "moment";
// import PrivateLessonDailyDivWithPopOut from "./PrivateLessonDailyDivWithPopOut"

const CoachPrivateLessonsDailyCalendar = (props: IProps) => {
  let widthOfColumn = 180;
  let widthOfHorizontalLinesForGrid =
    props.allCoachesAndSchedules.length * widthOfColumn + 60;

  let marginLeftMultiplyNumber = 0;
  let privateLessonDate: string;
  let privateLessonTime: string;

  let returnsPercentageForLessonSlotWidth = (
    dayOfWeekAsNumber: number | string,
    amountOfTimeOfMatchingTimes: any
  ) => {
    console.log(dayOfWeekAsNumber);
    return widthOfColumn / Number(amountOfTimeOfMatchingTimes);
  };

  let returnsMarginLeftForPrivateLessonPlacementWithinWeekday = (
    privLessonDateFuncParam: string,
    privLessonTimeFuncParam: string,
    amountOfTimesLessonOccurs: any,
    dayOfWeekAsNum: any
  ) => {
    if (amountOfTimesLessonOccurs === 1) {
      return 0.1;
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

  // let determineWidthOfLesson = (
  //   numberOfLessons: number,
  //   widthOfColumn: number
  // ) => {
  //   return widthOfColumn / numberOfLessons;
  // };

  // let determineLeftMarginOfLesson = (
  //   widthOfALesson: number,
  //   numberThisLessonIs: number
  // ) => {
  //   return widthOfALesson * numberThisLessonIs;
  // };

  // let determineLessonsNumberWithThisCoach = (
  //   lesson: IFullPrivateLessonsSchedule
  // ) => {};

  return (
    <div>
      {props.isLoading && (
        <div
          className="col-12 text-center"
          style={{ zIndex: 2000, position: "fixed", margin: "auto" }}
        >
          <div>
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
        </div>
      )}
      <div
        className="calendar-container-daily"
        style={{
          opacity: `${props.isLoading ? "40%" : "100%"}`,
        }}
      >
        <div
          className="header-daily viewingdates-scroll-arrows-daily"
          style={{ zIndex: 2000 }}
        >
          <div
            className="d-flex align-items-center justify-content-start text-center"
            style={{
              backgroundColor: "white",
              position: "sticky",
              left: 10,
              top: 0,
            }}
          >
            <div
              style={{ position: "sticky", left: 0 }}
              className="d-flex flex-wrap justify-content-center"
            >
              <div className="col-12 p-0 d-flex flex-wrap">
                <div className="col-2 p-0">
                  <button
                    disabled={props.isLoading ? true : false}
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
                    <button disabled={props.isLoading ? true : false}>
                      <u>Go to today</u>
                    </button>
                  </div>
                  <div>
                    <p className="p-0 m-0" style={{ fontSize: "12px" }}>
                      {props.dateBeingSearched}
                    </p>
                  </div>
                </div>
                <div className="col-2 p-0">
                  <button
                    disabled={props.isLoading ? true : false}
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
            className="weekdays-aka-coach-names ul-daily"
            style={{
              margin: "0px",
              fontSize: "70%",
              gridTemplateColumns: `repeat(${props.allCoachesAndSchedules.length}, 1fr)`,
            }}
          >
            {props.allCoachesAndSchedules.map((coach, index1) => {
              return (
                <li
                  key={index1 * 10000}
                  style={{ width: `${widthOfColumn}` }}
                  className="d-block li-daily"
                >
                  {coach.coachesName}
                </li>
              );
            })}
            {/* <li className="d-sm-block d-none">Sunday</li>
          <li className="d-sm-block d-none">Monday</li>
          <li className="d-sm-block d-none">Tuesday</li>
          <li className="d-sm-block d-none">Wednesday</li>
          <li className="d-sm-block d-none">Thursday</li>
          <li className="d-sm-block d-none">Friday</li>
          <li className="d-sm-block d-none">Saturday</li>
          <li className="d-sm-none d-grid">Sun</li>
          <li className="d-sm-none d-grid">Mon</li>
          <li className="d-sm-none d-grid">Tue</li>
          <li className="d-sm-none d-grid">Wed</li>
          <li className="d-sm-none d-grid">Thu</li>
          <li className="d-sm-none d-grid">Fri</li>
          <li className="d-sm-none d-grid">Sat</li> */}
          </ul>

          {/* <ul className="daynumbers" style={{ margin: "0px" }}>
          <li>{props.daysOfWeek[0]}</li>
          <li>{props.daysOfWeek[1]}</li>
          <li>{props.daysOfWeek[2]}</li>
          <li>{props.daysOfWeek[3]}</li>
          <li>{props.daysOfWeek[4]}</li>
          <li>{props.daysOfWeek[5]}</li>
          <li>{props.daysOfWeek[6]}</li>
        </ul> */}
        </div>

        <div className="timeslots-container-daily">
          <ul
            className="timeslots-daily ul-daily"
            style={{
              margin: "0px",
            }}
          >
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              12<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              12:30<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              1<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              1:30<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              2<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              2:30<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              3<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              3:30<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              4<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              4:30<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              5<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              5:30<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              6<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              6:30<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              7<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              7:30<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              8<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              8:30<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              9<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              9:30<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              10<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              10:30<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              11<sup>am</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              11:30<sup>am</sup>
            </li>

            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              12<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              12:30<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              1<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              1:30<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              2<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              2:30<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              3<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              3:30<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              4<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              4:30<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              5<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              5:30<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              6<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              6:30<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              7<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              7:30<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              8<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              8:30<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              9<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              9:30<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              10<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              10:30<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              11<sup>pm</sup>
            </li>
            <li className="li-daily">
              <div
                className="li-daily-after"
                style={{
                  width: `${widthOfHorizontalLinesForGrid}px`,
                }}
              ></div>
              11:30<sup>pm</sup>
            </li>
          </ul>
        </div>
        {props.isLoading ? (
          <></>
        ) : (
          <div
            className="event-container-daily"
            style={{
              gridTemplateColumns: `repeat(${props.allCoachesAndSchedules.length}, 1fr)`,
            }}
          >
            {/* <div className="seperator-sun-mon"></div>
        <div className="seperator-mon-tue"></div>
        <div className="seperator-tue-wed"></div>
        <div className="seperator-wed-thurs"></div>
        <div className="seperator-thurs-fri"></div>
        <div className="seperator-fri-sat"></div> */}
            {props.allCoachesAndSchedules.map((seperator, index2) => {
              let gridCol = index2 + 2;
              return (
                <div
                  key={index2 * 20000}
                  style={{
                    position: "absolute",
                    height: "180rem",
                    width: "2px",
                    background: "lightgray",
                    zIndex: -2,
                    gridColumn: gridCol,
                  }}
                  className=""
                ></div>
              );
            })}

            {props.allCoachesAndSchedules.map((coach, index3) => {
              let gridCol = index3 + 1;
              return (
                <React.Fragment key={index3 * 30000}>
                  {coach.dailySchedule.map((lesson, index) => {
                    return (
                      <div
                        key={lesson.private_lesson_id}
                        className={`slot-daily lesson-slot-daily private-lesson-slot-daily
                     weekday${lesson.weekday_as_number}
                     ${lesson.series_name ? "series-slot" : ""}`}
                        style={{
                          position: "absolute",
                          zIndex: 1005,
                          gridRow:
                            dateTimeHandlingFunctions.startTimeValueForStyleSheet(
                              lesson.start_time
                            ),
                          height: `${dateTimeHandlingFunctions.amountOfTimeInPixelsForStyleSheetHeightCoachesAvailability(
                            lesson.start_time,
                            lesson.duration,
                            true
                          )}px`,
                          width: `${returnsPercentageForLessonSlotWidth(
                            // lesson.weekday_as_number,
                            gridCol,
                            lesson.amount_of_times_this_lessons_exact_date_and_time_occur
                          )}px`,
                          // width:"15%",
                          marginLeft: `${returnsMarginLeftForPrivateLessonPlacementWithinWeekday(
                            lesson.date_of_lesson,
                            lesson.start_time,
                            lesson.amount_of_times_this_lessons_exact_date_and_time_occur,
                            // lesson.weekday_as_number
                            gridCol
                          )}px`,
                          // marginLeft: `${determineLeftMarginOfLesson(
                          //   determineWidthOfLesson(
                          //     Number(
                          //       lesson.amount_of_times_this_lessons_exact_date_and_time_occur
                          //     ),
                          //     widthOfColumn
                          //   ),
                          // index
                          // )}px`,
                          gridColumn: gridCol,
                        }}
                      >
                        {
                          <PrivateLessonCalendarDivWithPopout
                            privateLesson={lesson}
                            boolUsedOnlyToReRenderComponentFunc={
                              props.boolFuncForReRender
                            }
                            isAdminBoolFromHeader={props.isAdminBoolFromHeader}
                            role={props.role}
                          />
                        }
                      </div>
                    );
                  })}
                  {coach.coachAvailability.map((availableDay) => {
                    // console.log(moment(props.dateBeingSearched).weekday());
                    if (
                      calCssValues.weekDayForMoment(
                        moment(props.dateBeingSearched).weekday()
                      ) == availableDay.day_of_week
                    ) {
                      return (
                        <div
                          className={`slot-daily all-availability-slots-daily ${availableDay.day_of_week}`}
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
                            width: `${widthOfColumn}`,
                            gridColumn: gridCol,
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
                    }
                  })}
                </React.Fragment>
              );
            })}
            {/* {props.allCoachesAndSchedules => { 
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
          })} */}

            {/* {!coachesWeeklyScheduleForTheWeek ||
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
        )} */}
            <div
              className="timeline-daily blueline-marks-time-daily"
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
        )}
      </div>
    </div>
  );
};

export default CoachPrivateLessonsDailyCalendar;

interface IProps {
  allCoachesAndSchedules: IDailyScheduleForCoach[];
  currentTimeForCalendarBlueLine: any;
  dateBeingSearched: string;
  handleLeftArrowWeekCycle: Function | any;
  handleRightArrowWeekCycle: Function | any;
  goToTodaysDate: Function | any;
  isLoading: boolean;
  boolFuncForReRender: any;
  isAdminBoolFromHeader: boolean;
  role: string | undefined;
}
