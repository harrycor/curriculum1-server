import { Router } from "express";
import db from "../db";

const router = Router();

router.post("/getAllWrestlersInTenant", async (req, res) => {
  let UID = Number(req.body.UID);

  res.json(await db.personal_info.allPeopleRelevantToUser(UID));
});

export default router;
