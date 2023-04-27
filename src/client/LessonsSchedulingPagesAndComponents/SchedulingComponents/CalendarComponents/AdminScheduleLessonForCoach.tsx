import * as React from "react";
import { useState, useEffect } from "react";
import ScheduleNewPrivateLessonForm from "../ScheduleNewPrivateLessonForm";

const AdminScheduleLessonForCoach = (props: IProps) => {
  const [showScheduleLesson, setShowScheduleLesson] = useState<boolean>(false);

  let handleScheduleLessonClicked = () => {
    setShowScheduleLesson(!showScheduleLesson);
  };

  return (
    <div className="m-1">
      <div className="col-12 text-center">
        <button
          onClick={handleScheduleLessonClicked}
          className="btn btn-sm btn-outline-success"
        >
          Schedule a lesson for {props.coachName}
        </button>
      </div>
      {showScheduleLesson && (
        <div>
          <ScheduleNewPrivateLessonForm
            funcFromStartPageToRenderComp={props.funcFromStartPageToRenderComp}
            coachId={props.coachUserId}
          />
        </div>
      )}
    </div>
  );
};

export default AdminScheduleLessonForCoach;

interface IProps {
  coachUserId: number;
  coachName: string;
  funcFromStartPageToRenderComp: Function;
}
