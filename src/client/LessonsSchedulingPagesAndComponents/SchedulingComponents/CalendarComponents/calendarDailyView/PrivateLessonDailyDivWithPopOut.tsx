import * as React from "react";
import { useState, useEffect } from "react";
import { IFullPrivateLessonsSchedule } from "../../../ServicesForPrivateLessonScheduling/interfaces";

const PrivateLessonDailyDivWithPopOut = (props: IProps) => {
  return (
    <div>
      <div>ehy</div>
    </div>
  );
};

export default PrivateLessonDailyDivWithPopOut;


interface IProps {
  privateLesson: IFullPrivateLessonsSchedule;
  boolUsedOnlyToReRenderComponentFunc: any;
  isAdminBoolFromHeader: boolean;
  role: string | undefined;
}