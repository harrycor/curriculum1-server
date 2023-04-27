import config from "../config";
import { Router } from "express";
import { verify } from "jsonwebtoken";
import db from "../db";
import { hasValidAdminToken, hasValidToken } from "../utils/tokenCheck";

const router = Router();

router.post(
  "/getAllActiveRecurringPaymentsContractsForUser",
  hasValidToken,
  async (req, res) => {
    let userId = req.body.userId;
    try {
      res
        .status(200)
        .json(
          await db.recurringPaymentContracts.selectAllActiveRecurringPaymentContractsByUserId(
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
  "/getAllActiveRecurringPaymentsContractsForTenant",
  hasValidAdminToken,
  async (req, res) => {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let tenantId = tokenVerify.tenant;
    try {
      res
        .status(200)
        .json(
          await db.recurringPaymentContracts.selectAllActiveRecurringPaymentContractsInTenant(
            tenantId
          )
        );
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.put(
  "/setRecurringPaymentContractToNotActive",
  hasValidToken,
  async (req, res) => {
    let recurringPaymentContract = req.body.recurringPaymentContractId;
    try {
      await db.recurringPaymentContracts.updateRecurringPaymentContractToNotActive(
        recurringPaymentContract
      );
      res.status(200).json({ message: "Subscription has been been canceled" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Something went wrong when trying to cancel your subscription",
      });
    }
  }
);

export default router;
