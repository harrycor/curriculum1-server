import db from "../db";
import config from "../config";
import e, * as express from "express";
import { Router } from "express";
import { hasValidAdminToken, hasValidCoachToken } from "../utils/tokenCheck";
import { verify } from "jsonwebtoken";

const router = Router();

// GET
router.get("/getAllItemTypes", async (req, res) => {
  try {
    let allItemTypes = await db.itemTypes.getAllItemTypes();
    res.status(200).json(allItemTypes);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get("/getAllItemTypesAndDateUnits", async (req, res) => {
  try {
    let allItemTypes = await db.itemTypes.getAllItemTypes();
    let dateUnits = await db.dateUnits.getAllDateUnits();
    res.status(200).json({ allItemTypes, dateUnits });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// POST
router.post("/addNewItemType", hasValidAdminToken, async (req, res) => {
  let itemType = req.body.newItemTypeName;
  let itemTypeDescription = req.body.newItemTypeDescription;
  let willExpire = req.body.willExpire === false ? 0 : 1;
  let trackAmountUsed = req.body.trackAmountUsed === false ? 0 : 1;
  let allowRecurringPaymentContract =
    req.body.allowRecurringPaymentContract === false ? 0 : 1;
  let isAPrivateLesson = req.body.isAPrivateLesson === true ? 1 : null;
  let isAPractice = req.body.isAPractice === true ? 1 : 0;
  let isUnlimited = req.body.isUnlimited === true ? 1 : 0;
  try {
    await db.itemTypes.addNewItemType(
      itemType,
      itemTypeDescription,
      willExpire,
      trackAmountUsed,
      allowRecurringPaymentContract,
      isAPrivateLesson,
      isAPractice,
      isUnlimited
    );
    res.status(200).json({ message: "Item type has been added" });
  } catch (error) {
    console.log(error);
    let message =
      error.code === "ER_DUP_ENTRY"
        ? "Duplicate entry, item not added"
        : "Something went wrong when trying to add new item type";
    res.status(500).json({
      message,
    });
  }
});

// PUT
router.put("/updateItemType", hasValidAdminToken, async (req, res) => {
  let itemTypeId = req.body.itemTypeId;
  let editItemTypeNewName = req.body.editItemTypeNewName;
  let editItemTypeDescription = req.body.editItemTypeDescription;
  let editWillExpire = req.body.editWillExpire === false ? 0 : 1;
  let editTrackAmountUsed = req.body.editTrackAmountUsed === false ? 0 : 1;
  let editAllowRecurringPaymentContract =
    req.body.editAllowRecurringPaymentContract === false ? 0 : 1;
  let editIsAPrivateLesson = req.body.editIsAPrivateLesson === true ? 1 : 0;
  let editIsAPractice = req.body.editIsAPractice === true ? 1 : 0;
  let editIsUnlimited = req.body.editIsUnlimited === true ? 1 : 0;
  try {
    await db.itemTypes.updateItemType(
      editItemTypeNewName,
      editItemTypeDescription,
      editWillExpire,
      editTrackAmountUsed,
      editAllowRecurringPaymentContract,
      editIsAPrivateLesson,
      editIsAPractice,
      editIsUnlimited,
      itemTypeId
    );
    res.status(200).json({ message: "Item type has been updated" });
  } catch (error) {
    console.log(error);
    let message =
      error.code === "ER_DUP_ENTRY"
        ? "Duplicate entry, item not added"
        : "Something went wrong when trying to update item type";
    res.status(500).json({
      message,
    });
  }
});

// DELETE
router.delete("/deleteItemType", hasValidAdminToken, async (req, res) => {
  let itemTypeId = req.body.itemTypeId;
  try {
    await db.itemTypes.deleteItemType(itemTypeId);
    res.status(200).json({ message: "Item type deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong when trying to delete item type",
    });
  }
});

export default router;
