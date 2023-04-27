import db from "../db";
import { Router } from "express";
import { hasValidAdminToken, hasValidCoachToken } from "../utils/tokenCheck";
import { verify } from "jsonwebtoken";
import config from "../config";

const router = Router();

// GET
router.get(
  "/getAllCoachsUserInformationWithPayoutPercentages",
  hasValidAdminToken,
  async (req, res) => {
    try {
      let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
      let tokenVerify: any = verify(token, config.jwt.secret);
      let tenantId = tokenVerify.tenant;
      res.json(
        await db.payoutPercentages.getAllCoachsUserInformationWithPayoutPercentages(
          tenantId
        )
      );
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

// POST
router.post(
  "/createNewPayoutPercentage",
  hasValidAdminToken,
  async (req, res) => {
    let coachsUserId = req.body.coachsUserId;
    let payoutPercentageOfPrivateLessons =
      req.body.payoutPercentageOfPrivateLessons;
    try {
      let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
      let tokenVerify: any = verify(token, config.jwt.secret);
      let tenantId = tokenVerify.tenant;
      let createdByUserId = tokenVerify.userId;
      await db.payoutPercentages.createNewPayoutPercentage(
        coachsUserId,
        payoutPercentageOfPrivateLessons,
        tenantId,
        createdByUserId
      );
      res
        .status(200)
        .json({ message: "Payout percentage has been created successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Something went when trying to create payout percentage",
      });
    }
  }
);

// PUT
// router.put("/updatePayoutPercentage", hasValidAdminToken, async (req, res) => {
//   console.log("yoooo")
//   let newPayoutPercentage = req.body.newPayoutPercentage;
//   let payoutPercentageId = req.body.payoutPercentageId;
//   try {
//     await db.payoutPercentages.updatePayoutPercentage(
//       newPayoutPercentage,
//       payoutPercentageId
//     );
//     res
//       .status(200)
//       .json({ message: "Payout percentage has been updated successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Something went wrong when trying to update payout percentage",
//     });
//   }
// });

export default router;
