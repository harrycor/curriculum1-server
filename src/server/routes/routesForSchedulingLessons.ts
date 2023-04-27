import db, { Query } from "../db";
import schedulingLessons from "../db/schedulingLessons";
import { Router } from "express";
import { hasValidCoachToken } from "../utils/tokenCheck";
import { verify, decode } from "jsonwebtoken";
import config from "../config";
import { IFullPrivateLessonsSchedule } from "../../client/LessonsSchedulingPagesAndComponents/ServicesForPrivateLessonScheduling/interfaces";
import {
  getWarZoneAdminAuthToken,
  getWrestlerInfoFromWarZone,
} from "./routesForWarZone";

const router = Router();

//  GET     //
router.get("/validateToketInputAvailability", (req, res) => {
  // this return info provided in token
  let token: string | any = req.headers.authorization?.split(" ")[1]; //removes bearer from the string
  let isValidToken = verify(token, config.jwt.secret);
  res.json(isValidToken);
});
router.get("/getitall", async (req, res) => {
  let responsers = await schedulingLessons.getAvails();
  res.json(responsers);
});
router.get("/getAllCoachesAndAdminsByTenant/:tenant", async (req, res) => {
  try {
    let tenant = req.params.tenant;
    let allCoachesAndAdmins =
      await schedulingLessons.getAllCoachesAndAdminsByTenant(tenant);
    res.json(allCoachesAndAdmins);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
router.get(
  "/getCoachesWeeklyAvailibityByCoachesId/:coachesId",
  async (req, res) => {
    try {
      let coachesId: number | string = req.params.coachesId;
      let coachesWeeklyAvailability =
        await schedulingLessons.getCoachesWeeklyAvailibityByCoachesId(
          coachesId
        );
      res.json(coachesWeeklyAvailability);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/getCoachesFullPrivateLessonsSchedule/:coachesId",
  async (req, res) => {
    try {
      let coachesId: string = req.params.coachesId;
      let coachesFullPrivateLessonsSchedule =
        await schedulingLessons.getCoachesFullPrivateLessonsSchedule(coachesId);
      res.json(coachesFullPrivateLessonsSchedule);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/getCoachesFullPrivateLessonsScheduleByWeek/:coachesId/:weekStartDate/:weekEndDate",
  async (req, res) => {
    try {
      let coachesId = req.params.coachesId;
      let weekStartDate = req.params.weekStartDate;
      let weekEndDate = req.params.weekEndDate;
      let coachesPrivateLessonsScheduleForTheSelectedWeek: IFullPrivateLessonsSchedule[] =
        await schedulingLessons.getCoachesFullPrivateLessonsScheduleByWeek(
          coachesId,
          weekStartDate,
          weekEndDate
        );
      if (coachesPrivateLessonsScheduleForTheSelectedWeek.length > 0) {
        coachesPrivateLessonsScheduleForTheSelectedWeek =
          await getWARInfoForWrestlers(
            coachesPrivateLessonsScheduleForTheSelectedWeek
          );
        // console.log(coachesPrivateLessonsScheduleForTheSelectedWeek);
      }
      res.json(coachesPrivateLessonsScheduleForTheSelectedWeek);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.post(
  "/getCoachesFullPrivateLessonsScheduleByDay/:date",
  async (req, res) => {
    let date = req.params.date;
    try {
      let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
      let tokenVerify: any = verify(token, config.jwt.secret);
      let tenantId = tokenVerify.tenant;
      let allActiveCoachesInTenant: {
        id: number;
        first_name: string | null;
        last_name: string | null;
      }[] = await db.users.getAllActiveCoachesAndAdminsUserInfoByTenantId(
        tenantId
      );
      // console.log(allActiveCoachesInTenant)
      let arrayOfCoachesDailySchedules:
        | any[]
        | {
            coachId: number;
            dailySchedule: [][];
            coachesName: string | null;
            coachAvailability: [][];
          }[] = [];
      for (let x = 0; x < allActiveCoachesInTenant.length; x++) {
        const coachesId = allActiveCoachesInTenant[x].id;
        const coachName = `${allActiveCoachesInTenant[x].first_name} ${allActiveCoachesInTenant[x].last_name}`;
        let objectArray: any = {};
        // console.log(objectArray)
        // arrayOfCoachesDailySchedules.push();
        let coachDailySchedule: any =
          await schedulingLessons.getCoachesFullPrivateLessonsScheduleByDay(
            coachesId,
            date
          );
        let coachAvailability =
          await schedulingLessons.getCoachesWeeklyAvailibityByCoachesId(
            coachesId
          );
        // console.log(coachAvailability);
        if (coachDailySchedule.length > 0) {
          coachDailySchedule = await getWARInfoForWrestlers(coachDailySchedule);
          // console.log(arrayOfCoachesDailySchedules);
        }
        objectArray.coachId = coachesId;
        objectArray.coachesName = coachName;
        objectArray.dailySchedule = coachDailySchedule;
        objectArray.coachAvailability = coachAvailability;
        // console.log(objectArray);
        arrayOfCoachesDailySchedules.push(objectArray);
      }
      // console.log(arrayOfCoachesDailySchedules);
      res.json(arrayOfCoachesDailySchedules);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.get("/getPhoneNumberByUserId/:userId", async (req, res) => {
  try {
    let userId = req.params.userId;
    let phoneNumber = await schedulingLessons.getPhoneNumberByUserId(userId);
    res.json(phoneNumber);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//  POST    //
router.post("/postNewAvailability", async (req, res) => {
  try {
    let coachId = req.body.coaches_UID;
    let weekday = req.body.dayOfWeek;
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;
    await schedulingLessons.postNewAvailability(
      coachId,
      weekday,
      startTime,
      endTime
    );
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post(
  "/scheduleNewPrivateLesson",
  hasValidCoachToken,
  async (req, res) => {
    try {
      let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
      let tokenVerify: any = verify(token, config.jwt.secret);
      let userIdFromToken = tokenVerify.userId;
      let coachId = req.body.coaches_UID;
      let wrestlersId = req.body.wrestlerId;
      let dateOfLesson = req.body.dateOfLesson;
      let startTime = req.body.startTime;
      let duration = req.body.duration;
      let notes = req.body.notes;
      let seriesName = req.body.seriesName;
      await schedulingLessons.postNewPrivateLesson(
        coachId,
        wrestlersId,
        dateOfLesson,
        startTime,
        duration,
        notes,
        seriesName,
        userIdFromToken
      );
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.post(
  "/scheduleNewPrivateLessonSeriesBatch",
  hasValidCoachToken,
  async (req, res) => {
    try {
      let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
      let tokenVerify: any = verify(token, config.jwt.secret);
      let userIdFromToken = tokenVerify.userId;
      let batch: [][] | any = req.body;
      for (let x = 0; x < batch.length; x++) {
        const element = batch[x];
        element.push(userIdFromToken);
      }
      // console.log(batch);
      // return;
      await schedulingLessons.postNewPrivateLessonSeriesBatch(batch);
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

//    PUT       //
router.put("/addPhoneNumber/:phoneNumber/:coachId", async (req, res) => {
  try {
    let phoneNumber = req.params.phoneNumber;
    let coachId = req.params.coachId;
    await schedulingLessons.putPhoneNumber(phoneNumber, coachId);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//    DELETE     //
router.delete(
  "/deleteTimeSlotAvailabilityForCoachByAvailId/:availabilityId",
  async (req, res) => {
    try {
      let availabilityId = req.params.availabilityId;
      await schedulingLessons.deleteTimeSlotAvailabilityForCoach(
        availabilityId
      );
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.delete(
  "/deleteIndividualPrivateLesson/:privateLessonId",
  hasValidCoachToken,
  async (req, res) => {
    try {
      let privateLessonId = req.params.privateLessonId;
      await schedulingLessons.deleteIndividualPrivateLesson(privateLessonId);
      res.status(200).json({ message: "Private lesson has been deleted" });
    } catch (error) {
      console.log(error);
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        res.status(500).json({
          message:
            "Could not delete private lesson. Make sure the lesson is NOT completed; If a lesson is completed, it cannot be deleted",
        });
      } else {
        res.status(200).json({
          message: "Something went wrong when trying to delete private lesson",
        });
      }
    }
  }
);

router.delete(
  "/deletePrivateLessonSeriesMovingForward/:seriesName/:privateLessonId",
  hasValidCoachToken,
  async (req, res) => {
    try {
      let seriesName = req.params.seriesName;
      let privateLessonId = req.params.privateLessonId;
      await schedulingLessons.deletePrivateLessonSeriesMovingForward(
        seriesName,
        privateLessonId
      );
      res
        .status(200)
        .json({ message: "Private lesson series has been deleted" });
    } catch (error) {
      console.log(error);
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        res.status(500).json({
          message:
            "Could not delete private lesson series. Make sure all private lessons in the series are NOT completed, from the date you are trying to delete, until the end of the series; If a lesson is completed, it cannot be deleted",
        });
      } else {
        res.status(500).json({
          message:
            "Something went wrong when trying to delete private lesson series",
        });
      }
    }
  }
);

export default router;

const getWARInfoForWrestlers = async (
  wrestlers: IFullPrivateLessonsSchedule[] | any
) => {
  // get WZ access token
  let wZAccessToken = await getWarZoneAdminAuthToken();
  for (let x = 0; x < wrestlers.length; x++) {
    const wrestler = wrestlers[x];
    if (wrestler.war_zone_id) {
      try {
        await getWrestlerInfoFromWarZone(wrestler, wZAccessToken);
      } catch (error) {
        console.log(error);
        (wrestler.weight = null), (wrestler.age = null), (wrestler.WAR = null);
      }
    } else {
      (wrestler.weight = null), (wrestler.age = null), (wrestler.WAR = null);
    }
  }
  // console.log(wrestlers);
  return wrestlers;
};
