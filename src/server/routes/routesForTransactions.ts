import { Router } from "express";
import db, { Query } from "../db";
import { hasValidAdminToken, hasValidCoachToken } from "../utils/tokenCheck";
import * as moment from "moment";
import { verify } from "jsonwebtoken";
import config from "../config";
import { ITransactionWithPurchaseInfo } from "../../client/payments/interfacesForPayments";
import { ICart } from "../../client/payments/interfacesForPayments";

const router = Router();

// GET
router.get(
  "/getAllLessonsUsedInSelectedDateRangeForCoachId/:coachId/:dateFrom/:dateTo",
  async (req, res) => {
    let coachId = Number(req.params.coachId);
    let dateFrom = moment(req.params.dateFrom).toDate();
    let dateTo = moment(req.params.dateTo).toDate();
    try {
      let [coachesLifetimeEarningsForPrivateLessons]: {
        lifetime_amount_made_by_coach_for_private_lessons: number;
      }[] =
        await db.transactions.selectLifetimeEarningsOfPrivateLessonsForCoach(
          coachId
        );
      let [coachesLifetimeEarningsForPrivateLessonsDateRange]: {
        date_range_amount_made_by_coach_for_private_lessons: number;
      }[] =
        await db.transactions.selectLifetimeEarningsOfPrivateLessonsForCoachDateRange(
          coachId,
          dateFrom,
          dateTo
        );
      let privateLessonTransactionsForCoachInDateRange =
        await db.transactions.selectAllTransactionInDateRangeSelectForCoachId(
          coachId,
          dateFrom,
          dateTo
        );
      // console.log({ coachesLifetimeEarningsForPrivateLessons });
      // console.log({ coachesLifetimeEarningsForPrivateLessonsDateRange });
      res.status(200).json({
        coachesLifetimeEarningsForPrivateLessons:
          coachesLifetimeEarningsForPrivateLessons
            ? coachesLifetimeEarningsForPrivateLessons.lifetime_amount_made_by_coach_for_private_lessons
            : 0,
        coachesLifetimeEarningsForPrivateLessonsDateRange:
          coachesLifetimeEarningsForPrivateLessonsDateRange
            ? coachesLifetimeEarningsForPrivateLessonsDateRange.date_range_amount_made_by_coach_for_private_lessons
            : 0,
        privateLessonTransactionsForCoachInDateRange,
      });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/getAllPrivateLessonPurchasesForWrestler/:dateFrom/:dateTo",
  async (req, res) => {
    let dateFrom = moment(req.params.dateFrom).toDate();
    let dateTo = moment(req.params.dateTo).toDate();
    // console.log("**");
    // console.log(req.params);
    // console.log({ dateTo });
    // console.log({ dateFrom });
    try {
      let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
      let tokenVerify: any = verify(token, config.jwt.secret);
      let userId = tokenVerify.userId;
      let privateLessonPurchasesMadeByUser: ITransactionWithPurchaseInfo[] =
        await db.transactions.selectAllTransactionsOfPrivateLessonsPurchased(
          userId,
          dateFrom,
          dateTo
        );
      let allCheckInDateAndTimes: {
        purchases_id: number;
        date_of_lesson: Date;
        time_of_lesson: string;
      }[] =
        // WTF is this select statement... really.. idiot. this will not scale. disgraceful.
        await db.transactions.selectAllTransactionsDateOfUseForPrivateLessonsByPurchaseId(
          userId
        );
      for (let x = 0; x < privateLessonPurchasesMadeByUser.length; x++) {
        let checkInDateAndTimesForAllUsedPrivateLessons: Date[] = [];
        let { purchases_id: checkInPurchaseId } =
          privateLessonPurchasesMadeByUser[x];
        for (let y = 0; y < allCheckInDateAndTimes.length; y++) {
          let { purchases_id, date_of_lesson, time_of_lesson } =
            allCheckInDateAndTimes[y];
          if (checkInPurchaseId === purchases_id) {
            checkInDateAndTimesForAllUsedPrivateLessons.push(date_of_lesson);
          }
        }
        privateLessonPurchasesMadeByUser[x].datesOfUsedPrivateLessons =
          checkInDateAndTimesForAllUsedPrivateLessons;
      }
      // console.log(privateLessonPurchasesMadeByUser);
      let [amountOfLessonsRemaining]: {
        number_of_private_lessons_remaining: number;
      }[] = await db.transactions.getAmountOfRemainingPrivateLessonsForUser(
        userId
      );
      // console.log(amountOfLessonsRemaining);
      // console.log(privateLessonPurchasesMadeByUser);
      res.status(200).json({
        amountOfLessonsRemaining: amountOfLessonsRemaining
          ? amountOfLessonsRemaining.number_of_private_lessons_remaining
          : 0,
        privateLessonPurchasesMadeByUser,
      });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/getAllPracticePurchasesForWrestler/:dateFrom/:dateTo",
  async (req, res) => {
    let dateFrom = moment(req.params.dateFrom).toDate();
    let dateTo = moment(req.params.dateTo).toDate();
    // console.log("hey");
    // console.log({ dateFrom });
    // console.log({ dateTo });
    try {
      let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
      let tokenVerify: any = verify(token, config.jwt.secret);
      let userId = tokenVerify.userId;
      let arrayOfPurchaseIds: number[] = [];
      let allUnlimitedPracticePurchases: ITransactionWithPurchaseInfo[] =
        await db.transactions.selectAllUnlimitedPracticePurchasesWithinDateRangeForWrestler(
          userId,
          dateFrom,
          dateTo
        );
      let allNotUnlimitedPracticePurchasesMadeByUser: ITransactionWithPurchaseInfo[] =
        await db.transactions.selectAllNotUnlimitedPracticePurchasesMadeByUserFromTransactions(
          userId,
          dateFrom,
          dateTo
        );
      // console.log(allUnlimitedPracticePurchases);
      // console.log(allNotUnlimitedPracticePurchasesMadeByUser);
      let allPracticePurchasesMadeByUserCombined: ITransactionWithPurchaseInfo[] =
        allUnlimitedPracticePurchases;
      // get array
      for (
        let y = 0;
        y < allNotUnlimitedPracticePurchasesMadeByUser.length;
        y++
      ) {
        allPracticePurchasesMadeByUserCombined.push(
          allNotUnlimitedPracticePurchasesMadeByUser[y]
        );
      }
      for (let x = 0; x < allPracticePurchasesMadeByUserCombined.length; x++) {
        arrayOfPurchaseIds.push(
          allPracticePurchasesMadeByUserCombined[x].purchases_id
        );
      }
      let allPracticeCheckInDateAndTimes =
        arrayOfPurchaseIds.length > 0
          ? await db.transactions.selectAllPracticeCheckInsForUserId(
              userId,
              arrayOfPurchaseIds
            )
          : [];
      for (let z = 0; z < allPracticePurchasesMadeByUserCombined.length; z++) {
        let arrayOfDates: Date[] = [];
        let { purchases_id: checkInPurchasesId } =
          allPracticePurchasesMadeByUserCombined[z];
        for (let w = 0; w < allPracticeCheckInDateAndTimes.length; w++) {
          let { purchases_id, check_in_date_and_time } =
            allPracticeCheckInDateAndTimes[w];
          if (checkInPurchasesId === purchases_id) {
            arrayOfDates.push(check_in_date_and_time);
          }
        }
        allPracticePurchasesMadeByUserCombined[z].datesOfUsedPractices =
          arrayOfDates;
      }
      allPracticePurchasesMadeByUserCombined.sort((a: any, b: any) => {
        return a.purchase_date - b.purchase_date;
      });
      // console.log(allPracticeCheckInDateAndTimes);
      // console.log(allPracticePurchasesMadeByUserCombined);
      res.status(200).json(allPracticePurchasesMadeByUserCombined);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/getAllLessonsUsedInMonthSelectedForWrestlerId/:wrestlerId/:dateFrom/:dateTo",
  async (req, res) => {
    let wrestlerId = Number(req.params.wrestlerId);
    let dateFrom = moment(req.params.dateFrom).toDate();
    let dateTo = moment(req.params.dateTo).toDate();
    try {
      let usedPrivateLessonsTransactions =
        await db.transactions.selectAllUsedPrivateLessonsFromTransactionsWithInDateRangeForWrestlerId(
          wrestlerId,
          dateFrom,
          dateTo
        );
      // console.log(usedPrivateLessonsTransactions);
      res.status(200).json(usedPrivateLessonsTransactions);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/getAllPracticeCheckInsInMonthSelectedForWrestlerId/:wrestlerId/:dateFrom/:dateTo",
  async (req, res) => {
    let wrestlerId = Number(req.params.wrestlerId);
    let dateFrom = moment(req.params.dateFrom).toDate();
    let dateTo = moment(req.params.dateTo).toDate();
    // console.log("yup");
    // console.log({ dateFrom });
    // console.log({ dateTo });
    // console.log(req.params);
    try {
      let usedPracticesTransactions =
        await db.transactions.selectAllUsedPracticesFromTransactionsInDateRangeForWrestlerId(
          wrestlerId,
          dateFrom,
          dateTo
        );
      // console.log(usedPracticesTransactions);
      res.status(200).json(usedPracticesTransactions);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

// POST
router.post(
  "/getNumberOfPrivateLessonsRemainingAndEachLessonUsedStatus",
  hasValidCoachToken,
  async (req, res) => {
    // console.log("*****");
    let coachsWeeklyScheduleOfLessons: IFullPrivateLessonsSchedule[] =
      req.body.coachsWeeklyScheduleOfLessons;
    let todaysDateTime = req.body.todaysDateAndTime;
    // console.log({todaysDateTime})
    try {
      // isolate userId from coaches schedule(no dupes)
      let userIdsArray: number[] = [];
      if (coachsWeeklyScheduleOfLessons.length > 0) {
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
        // get amount of lessons remaining for all user Ids in array
        let amountOfLessonsRemainingForEachUserInArray: {
          user_id: number;
          number_of_private_lessons_remaining: number;
        }[] =
          await db.transactions.getAmountOfRemainingPrivateLessonsForAllUsersInArray(
            userIdsArray
          );
        //   attach number of lessons remaining to each private lesson in coachs lesson object
        for (let y = 0; y < coachsWeeklyScheduleOfLessons.length; y++) {
          for (
            let z = 0;
            z < amountOfLessonsRemainingForEachUserInArray.length;
            z++
          ) {
            if (
              coachsWeeklyScheduleOfLessons[y].wrestler_user_id ===
              amountOfLessonsRemainingForEachUserInArray[z].user_id
            ) {
              coachsWeeklyScheduleOfLessons[y].lessonsRemaining =
                amountOfLessonsRemainingForEachUserInArray[
                  z
                ].number_of_private_lessons_remaining;
              break;
            }
          }
        }

        // isolate private lessons booking id into array of ids
        let privateLessonsBookingsIdArray: number[] = [];
        for (let x = 0; x < coachsWeeklyScheduleOfLessons.length; x++) {
          privateLessonsBookingsIdArray.push(
            coachsWeeklyScheduleOfLessons[x].private_lesson_id
          );
        }
        let allPrivateLessonsUsedFromTransactions: {
          private_lesson_bookings_id: number;
          check_in_date_and_time: Date;
        }[] =
          await db.transactions.selectAllTransactionsInArrayOfPrivateLessonsBookingsIds(
            privateLessonsBookingsIdArray
          );
        if (allPrivateLessonsUsedFromTransactions.length > 0) {
          for (let a = 0; a < coachsWeeklyScheduleOfLessons.length; a++) {
            for (
              let b = 0;
              b < allPrivateLessonsUsedFromTransactions.length;
              b++
            ) {
              if (
                coachsWeeklyScheduleOfLessons[a].private_lesson_id ===
                allPrivateLessonsUsedFromTransactions[b]
                  .private_lesson_bookings_id
              ) {
                // lesson used
                coachsWeeklyScheduleOfLessons[a].hasLessonBeenUsed = true;
                coachsWeeklyScheduleOfLessons[a].canCheckInBeRemoved =
                  canLessonCheckInBeRemoved(
                    allPrivateLessonsUsedFromTransactions[b]
                      .check_in_date_and_time,
                    todaysDateTime
                  );
                break;
              }
              if (b + 1 === allPrivateLessonsUsedFromTransactions.length) {
                coachsWeeklyScheduleOfLessons[a].hasLessonBeenUsed = false;
                coachsWeeklyScheduleOfLessons[a].canCheckInBeRemoved = false;
              }
            }
          }
        } else {
          for (let h = 0; h < coachsWeeklyScheduleOfLessons.length; h++) {
            coachsWeeklyScheduleOfLessons[h].hasLessonBeenUsed = false;
            coachsWeeklyScheduleOfLessons[h].canCheckInBeRemoved = false;
          }
        }
      }
      // console.log(userIdsArray);
      // console.log(coachsWeeklyScheduleOfLessons);

      res.status(200).json(coachsWeeklyScheduleOfLessons);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.get("/allTransactionsForPurchaseId/:purchaseId", async (req, res) => {
  try {
    let purchaseId = Number(req.params.purchaseId);
    let transactions = await db.transactions.getTransactionsForPurchase(
      purchaseId
    );
    res.status(200).json(transactions);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.post(
  "/checkInWrestlerForPrivateLesson",
  hasValidCoachToken,
  async (req, res) => {
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
    let checkInDateAndTime = moment(req.body.todaysDateAndTime).toDate();
    // console.log(req.body);
    // console.log(checkInDateAndTime);
    try {
      let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
      let tokenVerify: any = verify(token, config.jwt.secret);
      checkedInByUserId = tokenVerify.userId;
      let [payoutPercentageId] =
        await db.payoutPercentages.getCurrentPayoutPercentageForCoachsId(
          coachUserId
        );
      let [userInfoOnWrestler] = await db.users.singleUser(wrestlerUserId);
      tenantId = userInfoOnWrestler.tenant;
      // console.log(tenantId);
      let transactionsWithAvailablePrivateLessonCredits: ITransactionInfoForPrivateLessonCheckIn[] =
        await db.transactions.selectAllTransactionsWithAvailablePrivateLessonCredits(
          wrestlerUserId
        );
      // console.log(transactionsWithAvailablePrivateLessonCredits);
      let {
        user_id,
        payments_id,
        purchases_id,
        number_of_lessons_remaining,
        item_type_id,
        is_a_private_lesson,
        deactivation_date,
        keep_track_of_amount_used,
        total_price_of_service_or_merchandise,
        number_of_items_included,
      } = transactionsWithAvailablePrivateLessonCredits[0];
      await db.transactions.checkInWrestlerForPrivateLesson(
        user_id,
        tenantId,
        payments_id,
        purchases_id,
        item_type_id,
        is_a_private_lesson,
        deactivation_date,
        keep_track_of_amount_used,
        wrestlerUserId,
        coachUserId,
        checkedInByUserId,
        payoutPercentageId && payoutPercentageId.id
          ? payoutPercentageId.id
          : null,
        privateLessonBookingsId,
        Number(
          (
            total_price_of_service_or_merchandise / number_of_items_included
          ).toFixed(2)
        ),
        dateOfLesson,
        timeOfLesson,
        checkInDateAndTime
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
  "/checkInWrestlerForPractice",
  hasValidCoachToken,
  async (req, res) => {
    let wrestlerId = req.body.wrestlerId;
    let todaysDate = moment(req.body.todaysDate).toDate();
    let startOfDay = moment(req.body.startOfDay).toDate();
    let endOfDay = moment(req.body.endOfDay).toDate();
    let confirmSameDayCheckIn: boolean | undefined =
      req.body.confirmSameDayCheckIn;
    // console.log({ todaysDate });
    // console.log({ startOfDay });
    // console.log({ endOfDay });
    try {
      let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
      let tokenVerify: any = verify(token, config.jwt.secret);
      let checkedInByUserId = tokenVerify.userId;
      let confirmIfWrestlerHasCheckedInForPracticeTodayAlready =
        await db.transactions.confirmIfWrestlerHasCheckedInForPracticeTodayAlready(
          wrestlerId,
          startOfDay,
          endOfDay
        );
      // console.log(confirmIfWrestlerHasCheckedInForPracticeTodayAlready);
      if (
        confirmIfWrestlerHasCheckedInForPracticeTodayAlready.length > 0 &&
        confirmSameDayCheckIn == undefined
      ) {
        res.status(200).json({
          message:
            "This wrestler has checked-in for practice already today. Are you sure you want to check them in again?",
          checkInSuccessful: false,
          requiresSecondConfirm: true,
        });
        return;
      }
      let getAllAvailableUnlimitedPractices: ITransaction[] =
        await db.transactions.selectAllAvailableUnlimitedPracticesForUserId(
          todaysDate,
          wrestlerId
        );
      // console.log(getAllAvailableUnlimitedPractices)
      // console.log(getAllAvailableUnlimitedPractices);
      if (getAllAvailableUnlimitedPractices.length > 0) {
        // if (false) {
        let {
          tenant_id,
          payments_id,
          purchases_id,
          item_type_id,
          is_a_private_lesson,
          keep_track_of_amount_used,
          deactivation_date,
          check_in_date_and_time,
          is_a_practice,
          is_unlimited,
        } = getAllAvailableUnlimitedPractices[0];
        await db.transactions.checkInWrestlerForPractice(
          wrestlerId,
          tenant_id,
          payments_id,
          purchases_id,
          item_type_id,
          is_a_private_lesson,
          keep_track_of_amount_used,
          deactivation_date,
          checkedInByUserId,
          todaysDate,
          is_a_practice,
          is_unlimited
        );
      } else {
        let getAllAvailablePracticesNOTUnlimited =
          await db.transactions.getAllAvailablePracticesNOTUnlimited(
            todaysDate,
            wrestlerId
          );
        // console.log(getAllAvailablePracticesNOTUnlimited);
        if (getAllAvailablePracticesNOTUnlimited.length > 0) {
          let {
            tenant_id,
            payments_id,
            purchases_id,
            item_type_id,
            is_a_private_lesson,
            keep_track_of_amount_used,
            deactivation_date,
            check_in_date_and_time,
            is_a_practice,
            is_unlimited,
          } = getAllAvailablePracticesNOTUnlimited[0];
          await db.transactions.checkInWrestlerForPractice(
            wrestlerId,
            tenant_id,
            payments_id,
            purchases_id,
            item_type_id,
            is_a_private_lesson,
            keep_track_of_amount_used,
            deactivation_date,
            checkedInByUserId,
            todaysDate,
            is_a_practice,
            is_unlimited
          );
        } else {
          res.status(200).json({
            message: "This customer has not paid",
            checkInSuccessful: false,
          });
          return;
        }
      }
      res.status(200).json({
        message: "Check-in successful",
        checkInSuccessful: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message:
          "Something went wrong trying to check-in wrestler for practice",
        checkInSuccessful: false,
      });
    }
  }
);

router.get(
  "/getAllCheckInsForTenantWithinDateRange/:tenantId/:dateFrom/:dateTo/:todaysDateAndTime",
  async (req, res) => {
    let tenantId = Number(req.params.tenantId);
    let todaysDateAndTime = req.params.todaysDateAndTime;
    let dateFrom = moment(req.params.dateFrom).toDate();
    let dateTo = moment(req.params.dateTo).toDate();
    // console.log(req.params);
    // console.log({todaysDateAndTime})
    // console.log({ dateFrom });
    // console.log({ dateTo });
    try {
      let getAllPracticeCheckInsWithInDateRange: {
        check_in_date_and_time: Date;
        checkInCanBeRemoved: boolean;
      }[] = await db.transactions.getAllPracticeCheckInsWithInDateRange(
        tenantId,
        dateFrom,
        dateTo
      );
      for (let x = 0; x < getAllPracticeCheckInsWithInDateRange.length; x++) {
        getAllPracticeCheckInsWithInDateRange[x].checkInCanBeRemoved =
          canLessonCheckInBeRemoved(
            getAllPracticeCheckInsWithInDateRange[x].check_in_date_and_time,
            todaysDateAndTime
          );
      }
      // console.log(getAllPracticeCheckInsWithInDateRange)
      res.status(200).json(getAllPracticeCheckInsWithInDateRange);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.post(
  "/insertTransactionMadeByAdminCashPay",
  hasValidAdminToken,
  async (req, res) => {
    let selectedUserId = req.body.selectedUserId;
    let cart: ICart[] = req.body.cart;
    let purchaseDate = moment(req.body.todaysDateAndTime).toDate();
    // console.log(purchaseDate);
    try {
      let cartTotal = await calculateCartTotalForAdminInsert(cart);
      let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
      let tokenVerify: any = verify(token, config.jwt.secret);
      let tenantId = tokenVerify.tenant;
      let adminUserId = tokenVerify.userId;
      let stripeAccountInfoByTenantId =
        await db.stripeAccounts.getStripeAccountInfoByTenantId(tenantId);
      //  payment insert for admin insert(cash pay)
      let paymentInsertIdForAdminInsert: { insertId: number } | any =
        await db.payments.insertNewPayment(
          selectedUserId,
          null,
          null,
          stripeAccountInfoByTenantId[0].stripe_account_id,
          "cash",
          adminUserId,
          purchaseDate
        );
      let paymentsId = paymentInsertIdForAdminInsert.insertId;
      for (let x = 0; x < cart.length; x++) {
        const {
          id,
          name_of_item,
          item_type_id,
          number_of_items_included,
          cost_of_item,
          // is_a_private_lesson,
          date_units_id_for_expiration,
          number_of_date_units_for_expiration,
          // keep_track_of_amount_used,
          has_recurring_payment_contract,
          // is_a_practice,
          // is_unlimited,
          quantity,
        } = cart[x];
        let [itemType]: {
          is_unlimited: number;
          is_a_private_lesson: number;
          keep_track_of_amount_used: number;
          is_a_practice: number;
        }[] = await db.itemTypes.selectSingleItemType(item_type_id);
        // console.log({ itemType });
        let dateUnit: { unit: "day" | "week" | "month" | "year" }[] | [] =
          date_units_id_for_expiration
            ? await db.dateUnits.getSingleDateUnitById(
                date_units_id_for_expiration
              )
            : [];
        // console.log({ dateUnit });
        // purchases insert
        let deactivationDate: Date | null =
          date_units_id_for_expiration &&
          number_of_date_units_for_expiration &&
          dateUnit.length > 0
            ? moment(purchaseDate)
                .add(number_of_date_units_for_expiration, dateUnit[0].unit)
                .toDate()
            : null;
        // console.log({ purchaseDate });
        // console.log({ deactivationDate });
        for (let y = 0; y < quantity; y++) {
          let purchaseInsert: { insertId: number } | any =
            await db.purchases.purchaseInsertForAdminInsertCashPay(
              selectedUserId,
              tenantId,
              name_of_item,
              item_type_id,
              number_of_items_included,
              cost_of_item,
              purchaseDate,
              paymentsId,
              itemType.is_a_private_lesson,
              deactivationDate,
              date_units_id_for_expiration,
              number_of_date_units_for_expiration,
              itemType.keep_track_of_amount_used,
              itemType.is_a_practice,
              itemType.is_unlimited
            );
          let purchaseId = purchaseInsert.insertId;
          // transactions insert
          await db.transactions.initialInsertAdminInsert(
            selectedUserId,
            tenantId,
            paymentsId,
            purchaseId,
            item_type_id,
            itemType.is_a_private_lesson === 1 ? 1 : 0,
            itemType.keep_track_of_amount_used === 1 ? 1 : 0,
            deactivationDate,
            number_of_items_included,
            itemType.is_a_practice,
            itemType.is_unlimited,
            adminUserId
          );
        }
      }
      res.status(200).json({ message: "Worked." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Didn't work." });
    }
  }
);

// DELETE
router.delete(
  "/removePrivateLessonCheckInForWrestler",
  hasValidCoachToken,
  async (req, res) => {
    // check if lessonsUsed checkin is less than 24 hours; if so they can remove checkin
    let privateLessonBookingsId = req.body.privateLessonBookingsId;
    let todaysDateAndTime = req.body.todaysDateAndTime;
    // console.log({todaysDateAndTime})
    try {
      let [privateLessonsInfoFromTransactions]: ITransaction[] =
        await db.transactions.selectSinglePrivateLessonCheckInForWrestler(
          privateLessonBookingsId
        );
      if (
        canLessonCheckInBeRemoved(
          privateLessonsInfoFromTransactions.check_in_date_and_time,
          todaysDateAndTime
        )
      ) {
        await db.transactions.removePrivateLessonCheckInForWrestler(
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

router.delete("/removeTransactionForPractice", async (req, res) => {
  let transactionId = req.body.transactionId;
  let checkInDateAndTime = req.body.checkInDateAndTime;
  let todaysDateAndTime = req.body.todaysDateAndTime;
  // console.log(req.body);
  try {
    if (canLessonCheckInBeRemoved(checkInDateAndTime, todaysDateAndTime)) {
      await db.transactions.removeTransactionByTransactionId(transactionId);
      res.status(200).json({
        message: "Check-in has been removed",
      });
      return;
    } else {
      res.status(200).json({
        message: "Cannot remove check-in after 24 hours",
      });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong trying to remove practice check-in",
    });
  }
});

export default router;

let canLessonCheckInBeRemoved = (
  lessonUsedCheckInDateAndTime: Date,
  todaysDateTime: string
) => {
  let todaysDate = moment(todaysDateTime).toDate();
  // console.log({ todaysDate });
  let dateCreatedAddTwentyFourHours = moment(lessonUsedCheckInDateAndTime)
    .add(24, "hours")
    .toDate();
  if (dateCreatedAddTwentyFourHours < todaysDate) return false;
  else return true;
};

let calculateCartTotalForAdminInsert = async (cart: ICart[]) => {
  let total = 0;
  for (let x = 0; x < cart.length; x++) {
    const cartItem = cart[x];
    total = total + cartItem.cost_of_item * cartItem.quantity;
  }
  return total;
};

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

interface ITransactionInfoForPrivateLessonCheckIn {
  user_id: number;
  payments_id: number;
  purchases_id: number;
  number_of_lessons_remaining: number;
  item_type_id: number;
  is_a_private_lesson: number;
  deactivation_date: Date;
  keep_track_of_amount_used: number;
  total_price_of_service_or_merchandise: number;
  number_of_items_included: number;
}

interface ITransaction {
  id: number;
  user_id: number;
  tenant_id: number;
  payments_id: number;
  purchases_id: number;
  item_type_id: number;
  is_a_private_lesson: number;
  is_a_practice: number;
  is_unlimited: number;
  keep_track_of_amount_used: number;
  deactivation_date: Date;
  wrestler_user_id: number;
  coach_user_id: number;
  checked_in_by_user_id: number;
  payout_percentage_id: number;
  private_lesson_bookings_id: number;
  price_paid_for_lesson: number;
  date_of_lesson: Date;
  time_of_lesson: string;
  check_in_date_and_time: Date;
  credit: number;
  debit: number;
  comments: string | null;
  number_of_lessons_remaining?: number;
  date_created: Date;
}
