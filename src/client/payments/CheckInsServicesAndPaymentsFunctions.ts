import { IFullPrivateLessonsSchedule } from "../LessonsSchedulingPagesAndComponents/ServicesForPrivateLessonScheduling/interfaces";
import { apiService } from "../services/api-services";
import * as date from "../services/dateAndTimeFunctions";

const checkInWrestlerForLessonFromCheckInAndStatusPanel = async (
  userId: number,
  dateAndTimeOfLesson: string
) => {
  return apiService("/api/lessonsUsed/checkInWrestlerForLesson", "POST", {
    userId,
    dateAndTimeOfLesson: `${dateAndTimeOfLesson.replace("T", " ")}:00`,
  });
};

const checkInWrestlerForLessonFromCalendar = async (
  wrestlerUserId: number,
  coachUserId: number,
  privateLessonBookingsId: number,
  dateOfLesson: string,
  timeOfLesson: string
) => {
  let todaysDateAndTime = date.createMomentCurrentDateTime();
  return apiService(
    "/api/transactions/checkInWrestlerForPrivateLesson",
    "POST",
    {
      wrestlerUserId,
      coachUserId,
      privateLessonBookingsId,
      dateOfLesson,
      timeOfLesson,
      todaysDateAndTime,
    }
  );
};

const removeCheckinForLessonFromCalendar = async (
  privateLessonBookingsId: number
) => {
  return apiService(
    "/api/transactions/removePrivateLessonCheckInForWrestler",
    "DELETE",
    {
      privateLessonBookingsId,
      todaysDateAndTime: date.createMomentCurrentDateTime(),
    }
  );
};

// this where we determine the lessons that are used and how many lessons the wrestlers has remaining
// this funtion is like a mullet... clean in the front, party in the back!
const getPurchasesInfoForWrestlersFromCalendar = async (
  coachsWeeklyScheduleOfLessons: IFullPrivateLessonsSchedule[]
) => {
  if (coachsWeeklyScheduleOfLessons.length > 0) {
    return apiService(
      "/api/transactions/getNumberOfPrivateLessonsRemainingAndEachLessonUsedStatus",
      "POST",
      {
        coachsWeeklyScheduleOfLessons,
        todaysDateAndTime: date.createMomentCurrentDateTime(),
      }
    )
      .then((res) => res)
      .catch(() => coachsWeeklyScheduleOfLessons);
    // this returns if there are no wrestlers in scheduled for the week
  } else return coachsWeeklyScheduleOfLessons;
};

export {
  checkInWrestlerForLessonFromCheckInAndStatusPanel,
  checkInWrestlerForLessonFromCalendar,
  removeCheckinForLessonFromCalendar,
  getPurchasesInfoForWrestlersFromCalendar,
};
