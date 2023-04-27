import * as express from "express";
import routesForUsers from "./routes/routesForUsers";
import routesForPersonal_info from "./routes/routesForPersonal_info";
import routesForVideos from "./routes/routesForVideos";
import routesForGrades from "./routes/routesForGrades";
import routesForSuccessfulLogins from "./routes/routesForSuccessfulLogins";
import { hasValidToken } from "./utils/tokenCheck";
import Contact from "./routes/Contact";
import routesForNotesFromCoachesForWrestlers from "./routes/routesForNotesFromCoachesForWrestlers";
import routesForEarnableItems from "./routes/EarnableItemsRoute";
import routesForLessonPlans from "./routes/routesForLessonPlans";
import routesForSchedulingLessons from "./routes/routesForSchedulingLessons";
import routesForTenants from "./routes/routesForTenants";
import routesForServicesAndMerchandise from "./routes/routesForServicesAndMerchandise";
import routesForStripeAccounts from "./routes/routesForStripeAccounts";
import routesForItemTypes from "./routes/routesForItemTypes";
import routesForPayoutPercentages from "./routes/routesForPayoutPercentages";
import routesForPurchases from "./routes/routesForPurchases";
import routesForLessonsUsed from "./routes/routesForLessonsUsed";
import routesForTransactions from "./routes/routesForTransactions";
import routesForAutomatedServices from "./routes/routesForAutomatedServices";
import routesForWrestlers from "./routes/routesForWrestlers";
import routesForTextMessages from "./routes/routesForTextMessages";
import routesForWarZone from "./routes/routesForWarZone";
import routesForRecurringPaymentContracts from "./routes/routesForRecurringPaymentContracts";
import routesForDateUnits from "./routes/routesForDateUnits";
import routesForPayments from "./routes/routesForPayments";
import routesForCronJobs from "./routes/routesForCronJobs";
import routesForChats from "./routes/routesForChats";

const router = express.Router();

router.get("/api/hello", (req, res, next) => {
  res.json("World");
});

router.use("/users", routesForUsers);
router.use("/personal_info", hasValidToken, routesForPersonal_info);
router.use("/videos", hasValidToken, routesForVideos);
router.use("/grades", hasValidToken, routesForGrades);
router.use("/successfulLogins", routesForSuccessfulLogins);
router.use("/contact", Contact);
router.use(
  "/coaches_notes_for_wrestlers",
  routesForNotesFromCoachesForWrestlers
);
router.use("/chats", routesForChats);
router.use("/earnableItems", routesForEarnableItems);
router.use("/lessonplans", routesForLessonPlans);
router.use("/schedulingLessons", routesForSchedulingLessons);
router.use("/tenants", routesForTenants);
router.use("/servicesAndMerchandise", routesForServicesAndMerchandise);
router.use("/stripeAccounts", routesForStripeAccounts);
router.use("/itemTypes", routesForItemTypes);
router.use("/payoutPercentages", routesForPayoutPercentages);
router.use("/purchases", routesForPurchases);
router.use("/lessonsUsed", routesForLessonsUsed);
router.use("/transactions", routesForTransactions);
router.use("/automatedServices", routesForAutomatedServices);
router.use("/wrestlers", routesForWrestlers);
router.use("/textMessages", routesForTextMessages);
router.use("/warZone", routesForWarZone);
router.use("/recurringPaymentContracts", routesForRecurringPaymentContracts);
router.use("/dateUnits", routesForDateUnits);
router.use("/payments", routesForPayments);
router.use("/cronJobs", routesForCronJobs);

export default router;
