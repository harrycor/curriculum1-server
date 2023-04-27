import * as React from "react";
import { useState, useEffect } from "react";
import moment from "moment";
import {
  IAvailabilityForCoachesId,
  IFullPrivateLessonsSchedule,
} from "../../../ServicesForPrivateLessonScheduling/interfaces";
import CoachPrivateLessonsDailyCalendar from "./CoachPrivateLessonsDailyCalendar";
import { getPurchasesInfoForWrestlersFromCalendar } from "../../../../payments/CheckInsServicesAndPaymentsFunctions";

const CoachesDailyPrivateLessonScheduleHeader = (props: IProps) => {
  const dateFormatToProcess: string = "YYYY-MM-DD";
  const dateFormatToView: string = "MMMM, DD, YYYY";
  const [currentTimeForCalendarBlueLine, setCurrentTimeForCalendarBlueLine] =
    useState<any>(moment().format("HH:mm:00"));
  const [todaysDateForViewOnly, setTodaysDateForViewOnly] = useState(
    moment().format(dateFormatToView)
  );
  const [todaysDateToBeManipulated, setTodaysDateToBeManipulated] = useState(
    moment().format(dateFormatToProcess)
  );
  const [selectedDate, setSelectedDate] = useState<string>();
  const [
    dailyScheduleForAllCoachesInTenant,
    setDailyScheduleForAllCoachesInTenant,
  ] = useState<IDailyScheduleForCoach[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [boolForRender, setBoolForRender] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    let token = localStorage.getItem("token");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    isMounted && setLoading(true);
    fetch(
      `/api/schedulingLessons/getCoachesFullPrivateLessonsScheduleByDay/${todaysDateToBeManipulated}`,
      requestOptions
    )
      .then((res) => res.json())
      .then(async (res: IDailyScheduleForCoach[]) => {
        if (isMounted) {
          if (
            props.isStripeAccountActive &&
            (props.role === "admin" || props.role === "coach")
          ) {
            for (let x = 0; x < res.length; x++) {
              res[x].dailySchedule =
                await getPurchasesInfoForWrestlersFromCalendar(
                  res[x].dailySchedule
                );
            }
            setDailyScheduleForAllCoachesInTenant(res);
          } else {
            setDailyScheduleForAllCoachesInTenant(res);
          }

          setLoading(false);
        }
        return;
      })
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, [todaysDateToBeManipulated, boolForRender]);

  let goToTodaysDate = () => {
    setTodaysDateToBeManipulated(moment().format(dateFormatToProcess));
  };

  let handleLeftArrowWeekCycle = () => {
    setTodaysDateToBeManipulated(
      moment(todaysDateToBeManipulated)
        .subtract(1, "days")
        .format(dateFormatToProcess)
    );
  };

  let handleRightArrowWeekCycle = () => {
    setTodaysDateToBeManipulated(
      moment(todaysDateToBeManipulated)
        .add(1, "days")
        .format(dateFormatToProcess)
    );
  };

  let renderFuncFromDaily = () => {
    setBoolForRender(!boolForRender);
  };

  return (
    <div>
      <div>
        <div className="mt-1 mb-1 text-center d-flex justify-content-center align-items-end">
          <div className="pl-2 pr-2 pt-1 pb-1 card">
            <div>
              <h5>Search date:</h5>
              <input
                onChange={(e: any) =>
                  setTodaysDateToBeManipulated(e.target.value)
                }
                type="date"
                value={todaysDateToBeManipulated}
              />
            </div>

            <div className="d-flex justify-content-center flex-wrap">
              {/* <div className="col-12">
                <button
                  className="btn btn-secondary"
                  // onClick={handleSearchMonthAndYear}
                >
                  Search
                </button>
              </div> */}
              <div
                className="mt-1 col-12"
                style={{ fontSize: "10px" }}
                onClick={goToTodaysDate}
              >
                <button className="btn btn-sm btn-dark">
                  <u>Go to today</u>
                </button>
              </div>
            </div>
            <div className="d-flex mt-3 mb-3 justify-content-center text-center">
            <div
              className="coaches-availability-legend ml-3 mr-3 d-flex align-items-center"
              style={{
                height: "80px",
                width: "75px",
                backgroundColor: "lightgray",
                borderColor: "red",
                borderStyle: "solid",
                borderWidth: "2px",
                borderRadius: "5px",
              }}
            >
              <small>Coach is available for lessons</small>
            </div>
            <div
              className="lesson-series-legend ml-3 mr-3 d-flex align-items-center"
              style={{
                height: "80px",
                width: "75px",
                backgroundColor: "limegreen",
                borderColor: "black",
                borderStyle: "solid",
                borderWidth: "2px",
                borderRadius: "5px",
              }}
            >
              <small>Single lesson</small>
            </div>
            <div
              className="private-lesson-legend ml-3 mr-3 d-flex align-items-center"
              style={{
                height: "80px",
                width: "75px",
                backgroundColor: "coral",
                borderColor: "aqua",
                borderStyle: "solid",
                borderWidth: "2px",
                borderRadius: "5px",
              }}
            >
              <small>Weekly lesson</small>
            </div>
          </div>
          </div>
        </div>
        {dailyScheduleForAllCoachesInTenant && (
          <div>
            <CoachPrivateLessonsDailyCalendar
              currentTimeForCalendarBlueLine={currentTimeForCalendarBlueLine}
              allCoachesAndSchedules={dailyScheduleForAllCoachesInTenant}
              dateBeingSearched={todaysDateToBeManipulated}
              handleLeftArrowWeekCycle={handleLeftArrowWeekCycle}
              handleRightArrowWeekCycle={handleRightArrowWeekCycle}
              goToTodaysDate={goToTodaysDate}
              isLoading={loading}
              boolFuncForReRender={renderFuncFromDaily}
              isAdminBoolFromHeader={props.isAdminBoolFromHeader}
              role={props.role}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachesDailyPrivateLessonScheduleHeader;

export interface IDailyScheduleForCoach {
  coachId: number;
  coachesName: string;
  dailySchedule: IFullPrivateLessonsSchedule[];
  coachAvailability: IAvailabilityForCoachesId[];
}

interface IProps {
  isAdminBoolFromHeader: boolean;
  role: string | undefined;
  coachesId: number | any;
  isStripeAccountActive?: boolean;
}
