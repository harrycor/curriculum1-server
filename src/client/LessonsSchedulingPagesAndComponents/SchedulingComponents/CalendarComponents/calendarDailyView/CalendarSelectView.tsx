import * as React from "react";
import { useState, useEffect } from "react";
import CoachesDailyPrivateLessonScheduleHeader from "./CoachesDailyPrivateLessonScheduleHeader";
import CoachesPrivateLessonScheduleWeeklyCalendarHeader from "../CoachesPrivateLessonScheduleWeeklyCalendarHeader";

const CalendarSelectView = (props: IProps) => {
  const [showWeeklyView, setShowWeeklyView] = useState<boolean>(true);
  const [showDailyView, setShowDailyView] = useState<boolean>(false);

  let handleShowWeeklyView = () => {
    setShowWeeklyView(!showWeeklyView);
    setShowDailyView(false);
  };
  let handleShowDailyView = () => {
    setShowDailyView(!showDailyView);
    setShowWeeklyView(false);
  };

  return (
    <div>
      <div>
        <button onClick={handleShowWeeklyView} className="btn btn-sm btn-info">
          Weekly
        </button>
        <button onClick={handleShowDailyView} className="btn btn-sm btn-info">
          Daily
        </button>
      </div>
      <div>
        {showWeeklyView && (
          <div>
            <CoachesPrivateLessonScheduleWeeklyCalendarHeader
              coachesId={props.coachesId}
              boolForRenderFromStartPage={props.boolForRenderFromStartPage}
              isAdminBool={true}
              isStripeAccountActive={props.isStripeAccountActive}
              role={props.role}
            />
          </div>
        )}
        {showDailyView && (
          <div>
            <CoachesDailyPrivateLessonScheduleHeader
              coachesId={props.coachesId}
              isAdminBoolFromHeader={props.role === "admin" ? true : false}
              isStripeAccountActive={props.isStripeAccountActive}
              role={props.role}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarSelectView;

interface IProps {
  coachesId: number | any;
  propUsedOnlyForReRender?: boolean;
  boolForRenderFromStartPage?: boolean;
  coachesName?: string;
  isAdminBool: boolean;
  isStripeAccountActive?: boolean;
  role: string | undefined;
}
