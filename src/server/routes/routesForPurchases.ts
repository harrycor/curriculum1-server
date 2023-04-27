import db from "../db";
import { Router } from "express";
import { hasValidAdminToken, hasValidCoachToken } from "../utils/tokenCheck";
import { verify } from "jsonwebtoken";
import config from "../config";

const router = Router();

// GET
router.get("/getAllPrivateLessonPurchasesForWrestler", async (req, res) => {
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let allPrivateLessonsPurchasesForWrestler: IPrivateLessonPurchaseHistoryForWrestler[] =
      await db.purchases.getAllPrivateLessonPurchasesForWrestler(
        tokenVerify.userId
      );
    let lessonsUsedByWrestler: {
      purchase_id: number;
      date_of_lesson: string;
      time_of_lesson: string;
    }[] = await db.lessonsUsed.getAllLessonsUsedPurchaseIdsByWreslterId(
      tokenVerify.userId
    );
    for (let x = 0; x < allPrivateLessonsPurchasesForWrestler.length; x++) {
      allPrivateLessonsPurchasesForWrestler[x].numberOfItemsUsed = 0;
      allPrivateLessonsPurchasesForWrestler[
        x
      ].dates_and_times_of_completed_lessons = [];
      for (let y = 0; y < lessonsUsedByWrestler.length; y++) {
        if (
          allPrivateLessonsPurchasesForWrestler[x].id ===
          lessonsUsedByWrestler[y].purchase_id
        ) {
          allPrivateLessonsPurchasesForWrestler[x].numberOfItemsUsed =
            Number(allPrivateLessonsPurchasesForWrestler[x].numberOfItemsUsed) +
            1;
          allPrivateLessonsPurchasesForWrestler[
            x
          ].dates_and_times_of_completed_lessons?.push({
            dateOfLesson: lessonsUsedByWrestler[y].date_of_lesson,
            timeOfLesson: lessonsUsedByWrestler[y].time_of_lesson,
          });
        }
      }
    }
    res.json(allPrivateLessonsPurchasesForWrestler);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
router.get("/purchasesForUser/:userId", async (req, res) => {
  let userId = req.params.userId;
  try {
    let paymentsForUser = await db.payments.viewPaymentsForUser(Number(userId));
    res.json(paymentsForUser);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get("/purchasesForPaymentId/:paymentId", async (req, res) => {
  let paymentId = Number(req.params.paymentId);
  try {
    let purchasesForPayment = await db.purchases.getAllPurchasesByPaymentId(
      paymentId
    );
    res.status(200).json(purchasesForPayment);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// POST
router.post(
  "/getAllPurchasesLssonsRemainingAndValidPractices",
  async (req, res) => {
    let userId = req.body.userId;
    try {
      res.json(
        await db.purchases.getAllPurchasesLssonsRemainingAndValidPractices(
          userId
        )
      );
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.post(
  "/lessonsUsedInfoFromArrayOfUserIds",
  hasValidCoachToken,
  async (req, res) => {
    // let userIdsArray: number[] = req.body.userIdsArray;
    // try {
    //   res.json(await db.purchases.lessonsInfoFromArrayOfUserIds(userIdsArray));
    // } catch (error) {
    //   console.log(error);
    //   res.sendStatus(500);
    // }
  }
);

export default router;

interface IPrivateLessonPurchaseHistoryForWrestler {
  id: number;
  name_of_item: string;
  number_of_items_included: number;
  purchase_date: number;
  total_price_of_service_or_merchandise: number;
  numberOfItemsUsed?: number;
  dates_and_times_of_completed_lessons?: {
    dateOfLesson: string;
    timeOfLesson: string;
  }[];
}

// let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
// let tokenVerify: any = verify(token, config.jwt.secret);
// let tenantId = tokenVerify.tenant;
