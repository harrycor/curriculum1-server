import db from "../db";
import config from "../config";
import { Router } from "express";
import { hasValidAdminToken, hasValidCoachToken } from "../utils/tokenCheck";
import { verify } from "jsonwebtoken";

const router = Router();
// GET
router.get("/getAllServicesAndMerchandiseByTenantId", async (req, res) => {
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let tenantId = tokenVerify.tenant;
    let tenantName = await db.tenants.getTenantName(tenantId);
    res.json([
      await db.servicesAndMerchandise.getAllServicesAndMerchandise(tenantId),
      tenantName,
    ]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// POST
router.post(
  "/addNewServiceOrMerchandise",
  hasValidAdminToken,
  async (req, res) => {
    let itemName = req.body.itemName;
    let itemCost = req.body.itemCost;
    let itemTypeId = req.body.itemTypeId;
    let numberOfItemsIncluded = req.body.numberOfItemsIncluded;
    let dateUnitsIdForExpiration = req.body.dateUnitsIdForExpiration;
    let numberOfDateUnitsForExpiration =
      dateUnitsIdForExpiration === null
        ? null
        : req.body.numberOfDateUnitsForExpiration;
    let itemHasRecurringPaymentContract =
      req.body.itemHasRecurringPaymentContract === true ? 1 : null;
    console.log(req.body);
    try {
      let token: any = req.headers.authorization?.split(" ")[1]; //removes bearer from the string
      let tokenVerify: any = verify(token, config.jwt.secret);
      let tenantId = tokenVerify.tenant;
      let userId = tokenVerify.userId;
      await db.servicesAndMerchandise.addNewServiceOrMerchandise(
        itemName,
        itemCost,
        itemTypeId,
        numberOfItemsIncluded,
        userId,
        tenantId,
        dateUnitsIdForExpiration,
        numberOfDateUnitsForExpiration,
        itemHasRecurringPaymentContract
      );
      res.status(200).json({ message: "New item has been added" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Item not added, something went wrong" });
    }
  }
);

router.post("/getCartTotal", async (req, res) => {
  let cartItemsIdNumbersAndQuantities: Array<{
    serviceOrMerchandiseId: number;
    quantity: number;
  }> = req.body.cartItemsIdNumbersAndQuantities;
  try {
    let cartTotal: number = 0;
    for (let x = 0; x < cartItemsIdNumbersAndQuantities.length; x++) {
      let [cartItemInfo] =
        await db.servicesAndMerchandise.getSingleServiceOrMerchandiseById(
          cartItemsIdNumbersAndQuantities[x].serviceOrMerchandiseId
        );
      cartTotal =
        cartTotal +
        cartItemInfo.cost_of_item * cartItemsIdNumbersAndQuantities[x].quantity;
    }
    res.status(200).json({ cartTotal });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// PUT
router.put(
  "/updateServiceOrMerchandise",
  hasValidAdminToken,
  async (req, res) => {
    let serviceOrMerchandiseId = req.body.serviceOrMerchandiseId;
    let itemName = req.body.itemName;
    let itemCost = req.body.itemCost;
    let itemTypeId = req.body.itemTypeId;
    let numberOfItemsIncluded = req.body.numberOfItemsIncluded;
    let dateUnitsIdForExpiration = req.body.dateUnitsIdForExpiration;
    let numberOfDateUnitsForExpiration =
      dateUnitsIdForExpiration === null
        ? null
        : req.body.numberOfDateUnitsForExpiration;
    let itemHasRecurringPaymentContract =
      req.body.itemHasRecurringPaymentContract === true ? 1 : null;
    console.log(req.body);
    try {
      await db.servicesAndMerchandise.updateServiceOrMerchandise(
        serviceOrMerchandiseId,
        itemName,
        itemCost,
        itemTypeId,
        numberOfItemsIncluded,
        dateUnitsIdForExpiration,
        numberOfDateUnitsForExpiration,
        itemHasRecurringPaymentContract
      );
      res
        .status(200)
        .json({ message: "Service or merchandise has been updated" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message:
          "Something went wrong when trying to update service or merchandise information",
      });
    }
  }
);

router.put(
  "/deactivateServiceOrMerchandise",
  hasValidAdminToken,
  async (req, res) => {
    let serviceOrMerchandiseId = req.body.serviceOrMerchandiseId;
    try {
      await db.servicesAndMerchandise.deactivateServiceOrMerchandise(
        serviceOrMerchandiseId
      );
      res
        .status(200)
        .json({ message: "Service or merchandise has been removed" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message:
          "Something went wrong when trying to remove service or merchandise",
      });
    }
  }
);

// DELETE
router.delete(
  "/deleteServiceOrMerchandiseById",
  hasValidAdminToken,
  async (req, res) => {
    let serviceOrMerchandiseId = req.body.serviceOrMerchandiseId;
    try {
      await db.servicesAndMerchandise.deleteServiceOrMerchandiseById(
        serviceOrMerchandiseId
      );
      res
        .status(200)
        .json({ message: "Service or merchandise has been deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message:
          "Something went wrong when trying to delete service or merchandise",
      });
    }
  }
);

export default router;
