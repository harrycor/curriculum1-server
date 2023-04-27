import db from "../db";
import { Router } from "express";
import { hasValidAdminToken } from "../utils/tokenCheck";
import * as moment from "moment";
const cron = require("node-cron");
const cronJobManager = require("cron-job-manager");
import checkRecurringPaymentStatuses from "../functionsForAutomation/checkRecurringPaymentStatusesFunction";
import sendTextMessage from "../twilio/textMessageFunctions";
import config from "../config";

const router = Router();
let createCronJobOnBuild = config.cron.createCronJobOnBuild;

const cronManager = new cronJobManager();
let cronJobManagerIdName = "checkRecurringPaymentContractStatus";

if (createCronJobOnBuild == "true") {
  let brandensWorstNightmare = cron.schedule("14 00 * * sun", () => {
    let message =
      "This is your weekly reminder that you're the best!!! Can you get us food? ~Jason";
    try {
      sendTextMessage(message, "6318361266");
    } catch (error) {
      console.log(error);
    }
  });

  cronManager.add(cronJobManagerIdName, "00 09,21 * * *", async () => {
    let recurringPaymentStatuses = await checkRecurringPaymentStatuses();
    console.log(`Cron job: ${recurringPaymentStatuses.message}`);
    await db.cronJobLogs.insertNewCronJobLog(
      Number(recurringPaymentStatuses.numberOfContractsCharged)
        ? Number(recurringPaymentStatuses.numberOfContractsCharged)
        : 0,
      moment().toDate()
    );
    await db.cronJobLogs.deleteOldCronJobLogs(
      moment().subtract("3", "months").toDate()
    );
  });
  cronManager.start(cronJobManagerIdName);
}

router.post("/createCronJob", hasValidAdminToken, async (req, res) => {
  let message: string;
  try {
    let cronJobManagerCheck = cronManager.exists(cronJobManagerIdName);
    console.log(cronJobManagerCheck);
    if (cronJobManagerCheck === true) {
      message = "Cron already exists.";
    } else {
      // cronManager.add(cronJobManagerIdName, "*/5 * * * * *", async () => {
      cronManager.add(cronJobManagerIdName, "00 09,21 * * *", async () => {
        let recurringPaymentStatuses = await checkRecurringPaymentStatuses();
        console.log(`Cron job: ${recurringPaymentStatuses.message}`);
        await db.cronJobLogs.insertNewCronJobLog(
          Number(recurringPaymentStatuses.numberOfContractsCharged)
            ? Number(recurringPaymentStatuses.numberOfContractsCharged)
            : 0,
          moment().toDate()
        );
        await db.cronJobLogs.deleteOldCronJobLogs(
          moment().subtract("3", "months").toDate()
        );
      });
      message = "Cron job has been created";
    }
    res.status(200).json({ message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Nope." });
  }
});

router.post(
  "/getAllCronJobsFromCronJobManager",
  hasValidAdminToken,
  async (req, res) => {
    try {
      let allCronJobs = cronManager.listCrons();
      let allCronJobLogs = await db.cronJobLogs.selectAllCronJobLogs();
      res
        .status(200)
        .json({ allCronJobsInManager: [allCronJobs], allCronJobLogs });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.post(
  "/startRecurringPaymentContractStatusCheckCronJob",
  hasValidAdminToken,
  async (req, res) => {
    let message: string;
    try {
      if (cronManager.exists(cronJobManagerIdName)) {
        cronManager.start(cronJobManagerIdName);
        message = "Cron job has started";
      } else {
        message = "Cron job does not exist. Create one.";
      }
      res.status(200).json({ message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something is not working" });
    }
  }
);

router.post(
  "/stopRecurringPaymentContractStatusCheckCronJob",
  hasValidAdminToken,
  async (req, res) => {
    let message: string;
    try {
      if (cronManager.exists(cronJobManagerIdName)) {
        cronManager.stop(cronJobManagerIdName);
        message = "Cron job has been stopped";
      } else {
        message = "Cron job does not exist. There is nothing to stop.";
      }
      res.status(200).json({ message });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "It's not working!" });
    }
  }
);

router.post("/deleteAllCronJobs", hasValidAdminToken, async (req, res) => {
  let message: string;
  try {
    cronManager.deleteAll();
    message = "All cron jobs have been deleted";
    res.status(200).json({ message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "It's not deleting!" });
  }
});

export default router;
