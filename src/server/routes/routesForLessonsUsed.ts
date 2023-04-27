import db from "../db";
import { Router } from "express";
import { hasValidAdminToken, hasValidCoachToken } from "../utils/tokenCheck";
import { verify } from "jsonwebtoken";
import config from "../config";
import { ILessonsUsedInfo } from "../../types";
import * as moment from "moment";

const router = Router();

router.get("/getAllLessonsUsedForWrestlerId/:wrestlerId", async (req, res) => {
  let wrestlerId = Number(req.params.wrestlerId);
  try {
    res.json(await db.lessonsUsed.getAllLessonsUsedForWrestlerId(wrestlerId));
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get(
  "/getAllLessonsUsedInMonthSelectedForWrestlerId/:wrestlerId/:dateFrom/:dateTo",
  async (req, res) => {
    let wrestlerId = Number(req.params.wrestlerId);
    let dateFrom = req.params.dateFrom;
    let dateTo = req.params.dateTo;
    try {
      res.json(
        await db.lessonsUsed.getAllLessonsUsedInMonthSelectedForWrestlerId(
          wrestlerId,
          dateFrom,
          dateTo
        )
      );
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/getAllLessonsUsedInSelectedDateRangeForCoachId/:coachId/:dateFrom/:dateTo",
  async (req, res) => {
    let coachId = Number(req.params.coachId);
    let dateFrom = req.params.dateFrom;
    let dateTo = req.params.dateTo;
    let grossEarnings: number | string = 0;
    let selectedDateRangeEarnings: number | string = 0;
    try {
      let lessonsUsedForGrossEarnings: {
        price_paid_for_lesson: number;
        payout_percentage_of_private_lessons: number;
      }[] = await db.lessonsUsed.pricePaidForlessonAndPayoutPercentageOfAllTime(
        coachId
      );
      let lessonsUsedForSelectedDateRangeEarnings: {
        price_paid_for_lesson: number;
        payout_percentage_of_private_lessons: number;
      }[] = await db.lessonsUsed.pricePaidForlessonAndPayoutPercentageDateRange(
        coachId,
        dateFrom,
        dateTo
      );
      for (let a = 0; a < lessonsUsedForGrossEarnings.length; a++) {
        grossEarnings =
          grossEarnings +
          (lessonsUsedForGrossEarnings[a].payout_percentage_of_private_lessons /
            100) *
            lessonsUsedForGrossEarnings[a].price_paid_for_lesson;
      }
      for (let b = 0; b < lessonsUsedForSelectedDateRangeEarnings.length; b++) {
        selectedDateRangeEarnings =
          selectedDateRangeEarnings +
          (lessonsUsedForSelectedDateRangeEarnings[b]
            .payout_percentage_of_private_lessons /
            100) *
            lessonsUsedForSelectedDateRangeEarnings[b].price_paid_for_lesson;
      }
      let lessonsUsed =
        await db.lessonsUsed.getAllLessonsUsedInDateRangeSelectedForCoachId(
          coachId,
          dateFrom,
          dateTo
        );
      grossEarnings = Number(grossEarnings).toFixed(2);
      selectedDateRangeEarnings = Number(selectedDateRangeEarnings).toFixed(2);
      res.json({ lessonsUsed, grossEarnings, selectedDateRangeEarnings });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.get("/getClubLifetimeEarnings", hasValidAdminToken, async (req, res) => {
  // clubs earnings from subscriptions and memberships
  let clubsLifetimeEarningsFromLessonsSold: number | string = 0;
  let clubsLifetimeEarningsFromLessonsUsed: number | string = 0;
  let clubsLifetimeEarningsFromMerch: number | string = 0;
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let allMerchSoldForTenant: { price_paid_for_lesson: number }[] =
      await db.purchases.getAllMerchPurchasesForTenant(tokenVerify.tenant);
    let allLessonsSoldForTenant: {
      total_price_of_service_or_merchandise: number;
    }[] = await db.purchases.getAllPrivateLessonPurchasesForTenant(
      tokenVerify.tenant
    );
    let allLessonsUsedForTenant: { price_paid_for_lesson: number }[] =
      await db.lessonsUsed.getAllLessonsUsedPricePaidForLessonForTenant(
        tokenVerify.tenant
      );
    for (let z = 0; z < allMerchSoldForTenant.length; z++) {
      clubsLifetimeEarningsFromMerch =
        clubsLifetimeEarningsFromMerch +
        allMerchSoldForTenant[z].price_paid_for_lesson;
    }
    for (let y = 0; y < allLessonsSoldForTenant.length; y++) {
      clubsLifetimeEarningsFromLessonsSold =
        clubsLifetimeEarningsFromLessonsSold +
        allLessonsSoldForTenant[y].total_price_of_service_or_merchandise;
    }
    for (let x = 0; x < allLessonsUsedForTenant.length; x++) {
      clubsLifetimeEarningsFromLessonsUsed =
        clubsLifetimeEarningsFromLessonsUsed +
        allLessonsUsedForTenant[x].price_paid_for_lesson;
    }
    clubsLifetimeEarningsFromMerch = Number(
      clubsLifetimeEarningsFromMerch
    ).toFixed(2);
    clubsLifetimeEarningsFromLessonsSold = Number(
      clubsLifetimeEarningsFromLessonsSold
    ).toFixed(2);
    clubsLifetimeEarningsFromLessonsUsed = Number(
      clubsLifetimeEarningsFromLessonsUsed
    ).toFixed(2);
    res.status(200).json({
      clubsLifetimeEarningsFromMerch,
      clubsLifetimeEarningsFromLessonsSold,
      clubsLifetimeEarningsFromLessonsUsed,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get(
  "/getClubEarningsWithinDateRange/:dateFrom/:dateTo",
  hasValidAdminToken,
  async (req, res) => {
    let dateFrom = req.params.dateFrom;
    let dateTo = req.params.dateTo;
    let dateRangeEarnings: number | string = 0;
    try {
      let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
      let tokenVerify: any = verify(token, config.jwt.secret);
      let allLessonsUsedForTenantWithInDateRange: {
        price_paid_for_lesson: number;
      }[] = await db.lessonsUsed.getAllLessonsUsedPricePaidForLessonForTenantWithInDateRange(
        tokenVerify.tenant,
        dateFrom,
        dateTo
      );
      for (let x = 0; x < allLessonsUsedForTenantWithInDateRange.length; x++) {
        dateRangeEarnings =
          dateRangeEarnings +
          allLessonsUsedForTenantWithInDateRange[x].price_paid_for_lesson;
      }
      dateRangeEarnings = Number(dateRangeEarnings).toFixed(2);
      res.status(200).json(dateRangeEarnings);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.get("/getNumberOfLessonsRemainingForWreslter", async (req, res) => {
  let lessonsRemaining: number = 0;
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let [amountOfLessonsUsedFromDb] =
      await db.lessonsUsed.getAmountOfLessonsUsed(tokenVerify.userId);
    let lessonsPurchaseHistory: {
      purchase_id: number;
      user_id: number;
      total_price_of_service_or_merchandise: number;
      number_of_items_included: number;
    }[] = await db.purchases.lessonsPrchaseHistoryOfUserIdForLessonsUsedReference(
      tokenVerify.userId
    );
    if (lessonsPurchaseHistory.length === 0) {
      res.status(200).json(lessonsRemaining);
      return;
    } else {
      for (let c = 0; c < lessonsPurchaseHistory.length; c++) {
        amountOfLessonsUsedFromDb.amount_of_lessons_used =
          amountOfLessonsUsedFromDb.amount_of_lessons_used -
          lessonsPurchaseHistory[c].number_of_items_included;
        if (amountOfLessonsUsedFromDb.amount_of_lessons_used < 0) {
          lessonsRemaining =
            amountOfLessonsUsedFromDb.amount_of_lessons_used * -1;
          for (let d = c + 1; d < lessonsPurchaseHistory.length; d++) {
            lessonsRemaining =
              lessonsRemaining +
              lessonsPurchaseHistory[d].number_of_items_included;
          }
          res.status(200).json(lessonsRemaining);
          return;
        } else if (amountOfLessonsUsedFromDb.amount_of_lessons_used === 0) {
          for (let d = c + 1; d < lessonsPurchaseHistory.length; d++) {
            lessonsRemaining =
              lessonsRemaining +
              lessonsPurchaseHistory[d].number_of_items_included;
          }
          res.status(200).json(lessonsRemaining);
          return;
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post(
  "/getPricePaidForLessonsAndCoachsPayoutPercentageForAllLessonsUsed",
  hasValidAdminToken,
  async (req, res) => {
    let coachsUserId = req.body.coachsUserId;
    try {
      res.json(
        await db.lessonsUsed.getPricePaidForLessonsAndCoachsPayoutPercentageForAllLessonsUsed(
          coachsUserId
        )
      );
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.post(
  "/getAllCheckInsMadeByCoachId",
  hasValidCoachToken,
  async (req, res) => {
    let coachsId = req.body.coachsId;
    try {
      res.json(await db.lessonsUsed.getAllCheckInsMadeByCoachId(coachsId));
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.post(
  "/checkInWrestlerForLesson",
  hasValidCoachToken,
  async (req, res) => {
    console.log(req.body);
    let pricePaidForLesson: number | any = undefined; //from DB
    let purchaseId: number | any = undefined; //from DB
    let tenantId: number; //from db with coach id
    let payoutPercentageId: number; //from db with coachs id
    let checkedInByUserId: number; //with token
    let wrestlerUserId = req.body.wrestlerUserId;
    let coachUserId = req.body.coachUserId;
    let privateLessonBookingsId = req.body.privateLessonBookingsId;
    let dateOfLesson = req.body.dateOfLesson;
    let timeOfLesson = req.body.timeOfLesson;
    try {
      let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
      let tokenVerify: any = verify(token, config.jwt.secret);
      checkedInByUserId = tokenVerify.userId;
      let [payoutPercentageId] =
        await db.payoutPercentages.getCurrentPayoutPercentageForCoachsId(
          coachUserId
        );
      let [tenantInfoOncoach] = await db.users.singleUser(coachUserId);
      tenantId = tenantInfoOncoach.tenant;
      console.log(tenantId);
      let allLessonsUsed: { purchase_id: number }[] =
        await db.lessonsUsed.getAllLessonsUsedPurchaseIdsForWreslterId(
          wrestlerUserId
        );
      let lessonsPurchaseHistory: {
        purchase_id: number;
        user_id: number;
        total_price_of_service_or_merchandise: number;
        number_of_items_included: number;
      }[] = await db.purchases.lessonsPrchaseHistoryOfUserIdForLessonsUsedReference(
        wrestlerUserId
      );
      // currently i dont chek to make sure there is a purchse history. this wouldnt break anything or trigger a check in just something to note
      if (allLessonsUsed.length === 0) {
        // no lessons have been used user lessonpurchhist[0].id
        purchaseId = lessonsPurchaseHistory[0].purchase_id;
        pricePaidForLesson =
          lessonsPurchaseHistory[0].total_price_of_service_or_merchandise /
          lessonsPurchaseHistory[0].number_of_items_included;
        console.log("1");
      } else {
        // there is a lesson used history greter than 0
        for (let c = 0; c < lessonsPurchaseHistory.length; c++) {
          console.log("2");
          if (Number(purchaseId)) break;
          let amountOfLessonsUsedWithCurrentPurchaseId = 0;
          for (let d = 0; d < allLessonsUsed.length; d++) {
            if (
              lessonsPurchaseHistory[c].purchase_id ===
              allLessonsUsed[d].purchase_id
            ) {
              amountOfLessonsUsedWithCurrentPurchaseId++;
              if (
                amountOfLessonsUsedWithCurrentPurchaseId ===
                lessonsPurchaseHistory[c].number_of_items_included
              ) {
                break;
              }
            }
            if (d + 1 === allLessonsUsed.length) {
              console.log("hit should show only once");
              purchaseId = lessonsPurchaseHistory[c].purchase_id;
              pricePaidForLesson =
                lessonsPurchaseHistory[c]
                  .total_price_of_service_or_merchandise /
                lessonsPurchaseHistory[c].number_of_items_included;
              break;
            }
          }
        }
      }
      console.log("3");
      await db.lessonsUsed.checkInWrestlerForLesson(
        wrestlerUserId,
        coachUserId,
        checkedInByUserId,
        tenantId,
        payoutPercentageId && payoutPercentageId.id
          ? payoutPercentageId.id
          : null,
        privateLessonBookingsId,
        purchaseId,
        pricePaidForLesson,
        dateOfLesson,
        timeOfLesson,
        Math.floor(new Date().getTime() / 1000)
      );
      res.status(200).json({ message: "Check-in submitted." });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message:
          "Something went wrong when trying to check-in wrestler. Check-in has not been submitted",
      });
    }
  }
);

router.post(
  "/lessonsUsedInfoFromArrayOfUserIds",
  hasValidCoachToken,
  async (req, res) => {
    // console.log("*****");
    let userIdsAndAmountOfLessonsRemaining: {
      userId: number;
      lessonsRemaining: number;
    }[] = [];
    let coachsWeeklyScheduleOfLessons: IFullPrivateLessonsSchedule[] =
      req.body.coachsWeeklyScheduleOfLessons;
    try {
      let userIdsArray: number[] = [];
      // this funtion only uses 1 for loop
      if (coachsWeeklyScheduleOfLessons.length > 0) {
        // firs we get an array of all userIds that appear in the weeklyscedarray
        for (let a = 0; a < coachsWeeklyScheduleOfLessons.length; a++) {
          if (a > 0) {
            for (let b = 0; b < userIdsArray.length; b++) {
              if (
                coachsWeeklyScheduleOfLessons[a].wrestler_user_id ===
                userIdsArray[b]
              ) {
                break;
              }
              if (b + 1 === userIdsArray.length) {
                userIdsArray.push(
                  coachsWeeklyScheduleOfLessons[a].wrestler_user_id
                );
              }
            }
          } else {
            userIdsArray.push(
              coachsWeeklyScheduleOfLessons[a].wrestler_user_id
            );
          }
        }
      }

      for (let a = 0; a < userIdsArray.length; a++) {
        let lessonsRemaining = 0;
        let [amountOfLessonsUsedFromDb] =
          await db.lessonsUsed.getAmountOfLessonsUsed(userIdsArray[a]);
        let lessonsPurchaseHistory: {
          purchase_id: number;
          user_id: number;
          total_price_of_service_or_merchandise: number;
          number_of_items_included: number;
        }[] = await db.purchases.lessonsPrchaseHistoryOfUserIdForLessonsUsedReference(
          userIdsArray[a]
        );
        // console.log(amountOfLessonsUsedFromDb);
        // console.log(lessonsPurchaseHistory);
        if (lessonsPurchaseHistory.length === 0) {
          userIdsAndAmountOfLessonsRemaining.push({
            userId: userIdsArray[a],
            lessonsRemaining,
          });
        } else {
          if (amountOfLessonsUsedFromDb.amount_of_lessons_used === 0) {
            for (let b = 0; b < lessonsPurchaseHistory.length; b++) {
              lessonsRemaining =
                lessonsRemaining +
                lessonsPurchaseHistory[b].number_of_items_included;
            }
            userIdsAndAmountOfLessonsRemaining.push({
              userId: userIdsArray[a],
              lessonsRemaining,
            });
          } else {
            for (let c = 0; c < lessonsPurchaseHistory.length; c++) {
              amountOfLessonsUsedFromDb.amount_of_lessons_used =
                amountOfLessonsUsedFromDb.amount_of_lessons_used -
                lessonsPurchaseHistory[c].number_of_items_included;
              if (amountOfLessonsUsedFromDb.amount_of_lessons_used < 0) {
                lessonsRemaining =
                  amountOfLessonsUsedFromDb.amount_of_lessons_used * -1;
                for (let d = c + 1; d < lessonsPurchaseHistory.length; d++) {
                  lessonsRemaining =
                    lessonsRemaining +
                    lessonsPurchaseHistory[d].number_of_items_included;
                }
                userIdsAndAmountOfLessonsRemaining.push({
                  userId: userIdsArray[a],
                  lessonsRemaining,
                });
                break;
              } else if (
                amountOfLessonsUsedFromDb.amount_of_lessons_used === 0
              ) {
                for (let d = c + 1; d < lessonsPurchaseHistory.length; d++) {
                  lessonsRemaining =
                    lessonsRemaining +
                    lessonsPurchaseHistory[d].number_of_items_included;
                }
                userIdsAndAmountOfLessonsRemaining.push({
                  userId: userIdsArray[a],
                  lessonsRemaining,
                });
                break;
              }
            }
          }
        }
      }
      for (let e = 0; e < coachsWeeklyScheduleOfLessons.length; e++) {
        for (let f = 0; f < userIdsAndAmountOfLessonsRemaining.length; f++) {
          if (
            coachsWeeklyScheduleOfLessons[e].wrestler_user_id ===
            userIdsAndAmountOfLessonsRemaining[f].userId
          ) {
            coachsWeeklyScheduleOfLessons[e].lessonsRemaining =
              userIdsAndAmountOfLessonsRemaining[f].lessonsRemaining;
            break;
          }
        }
      }
      // console.log(coachsWeeklyScheduleOfLessons);

      let privateLessonBookingsIdsArray: number[] = [];
      for (let x = 0; x < coachsWeeklyScheduleOfLessons.length; x++) {
        privateLessonBookingsIdsArray.push(
          coachsWeeklyScheduleOfLessons[x].private_lesson_id
        );
      }
      let lessonsUsedWithPLBId: {
        private_lesson_bookings_id: number;
        check_in_date_and_time: number;
      }[] = await db.lessonsUsed.getAlllessonsUsedByArrayOfPrivateLessonBookingsIds(
        privateLessonBookingsIdsArray
      );
      if (lessonsUsedWithPLBId.length > 0) {
        for (let y = 0; y < coachsWeeklyScheduleOfLessons.length; y++) {
          for (let z = 0; z < lessonsUsedWithPLBId.length; z++) {
            if (
              coachsWeeklyScheduleOfLessons[y].private_lesson_id ===
              lessonsUsedWithPLBId[z].private_lesson_bookings_id
            ) {
              // lesson used
              coachsWeeklyScheduleOfLessons[y].hasLessonBeenUsed = true;
              coachsWeeklyScheduleOfLessons[y].canCheckInBeRemoved =
                canLessonCheckInBeRemoved(
                  lessonsUsedWithPLBId[z].check_in_date_and_time
                );
              break;
            }
            if (z + 1 === lessonsUsedWithPLBId.length) {
              coachsWeeklyScheduleOfLessons[y].hasLessonBeenUsed = false;
              coachsWeeklyScheduleOfLessons[y].canCheckInBeRemoved = false;
            }
          }
        }
      } else {
        for (let h = 0; h < coachsWeeklyScheduleOfLessons.length; h++) {
          coachsWeeklyScheduleOfLessons[h].hasLessonBeenUsed = false;
          coachsWeeklyScheduleOfLessons[h].canCheckInBeRemoved = false;
        }
      }
      // console.log(coachsWeeklyScheduleOfLessons);
      res.json(coachsWeeklyScheduleOfLessons);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

// DELETE
router.delete(
  "/removeCheckInWrestlerForLesson",
  hasValidCoachToken,
  async (req, res) => {
    // check if lessonsUsed checkin is less than 24 hours; if so they can remove checkin
    let privateLessonBookingsId = req.body.privateLessonBookingsId;
    try {
      let [dateCheckInWasCreated]: ILessonsUsedInfo[] =
        await db.lessonsUsed.getLessonUsedInfoByPrivateLessonBookingsId(
          privateLessonBookingsId
        );
      if (
        canLessonCheckInBeRemoved(dateCheckInWasCreated.check_in_date_and_time)
      ) {
        // remove check in
        await db.lessonsUsed.removeCheckInWrestlerForLesson(
          privateLessonBookingsId
        );
        res.status(200).json({ message: "Check-in has been removed" });
      } else {
        // cannot delete; it has been more then 24 hours
        res
          .status(200)
          .json({ message: "Cannot delete check-in after 24 hours" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Something went wrong when trying to remove check-in",
      });
    }
  }
);

export default router;

interface IFullPrivateLessonsSchedule {
  private_lesson_id: number;
  coaches_user_id: number;
  coaches_first_name: string;
  coaches_last_name: string;
  wrestler_user_id: number;
  wrestler_first_name: string;
  wrestler_last_name: string;
  date_of_lesson: string;
  weekday_as_number: number | string;
  start_time: string;
  duration: number | string;
  amount_of_times_this_lessons_exact_date_and_time_occur: number | string;
  amount_of_times_this_lessons_exact_date_and_time_occur_minus_one:
    | number
    | string;
  series_name: string;
  notes: string;
  amountOfMatchingTimes?: number | string;
  lessonsRemaining?: number;
  hasLessonBeenUsed?: boolean;
  canCheckInBeRemoved?: boolean;
}

let canLessonCheckInBeRemoved = (lessonUsedCheckInDateAndTime: number) => {
  let todaysDate = moment().unix();
  let dateCreatedAddTwentyFourHours = moment
    .unix(lessonUsedCheckInDateAndTime)
    .add(24, "hours")
    .format("X");
  if (Number(dateCreatedAddTwentyFourHours) < Number(todaysDate)) return false;
  else return true;
};
