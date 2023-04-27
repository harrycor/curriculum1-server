import db from "../db";
import { Router } from "express";

const router = Router();

router.get("/getAllDateUnits", async (req, res) => {
  try {
    res.status(200).json(await db.dateUnits.getAllDateUnits());
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

export default router;
