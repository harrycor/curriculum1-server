import { Router } from "express";
import { verify } from "jsonwebtoken";
import * as moment from "moment";
import {
  IPaymentsAndPurchases,
  IPaymentsAndPurchasesForMultiUsers,
  ITransactionWithInfo,
} from "../../client/payments/interfacesForPayments";
import { IPayment } from "../../types";
import config from "../config";
import db from "../db";
import payments from "../db/payments";
import tenants from "../db/tenants";
import { hasValidAdminToken } from "../utils/tokenCheck";

const router = Router();

router.post(
  "/getAllPaymentsAndDetailsForUserId",
  hasValidAdminToken,
  async (req, res) => {
    let wrestlerId = req.body.wrestlerId;
    let dateFrom = moment(req.body.dateFrom).toDate();
    let dateTo = moment(req.body.dateTo).toDate();
    try {
      let [wrestlerPersonalInfo]:
        | { first_name: string; last_name: string }[]
        | undefined = await db.personal_info.singlePerson(wrestlerId);
      let wrestlerName = wrestlerPersonalInfo
        ? `${wrestlerPersonalInfo.first_name} ${wrestlerPersonalInfo.last_name}`
        : "N/A";
      let allPurchasesForUser: ITransactionWithInfo[] =
        await db.transactions.getAllPaymentTransactionsWithDetailsFOrUserId(
          wrestlerId,
          dateFrom,
          dateTo
        );
      console.log(allPurchasesForUser);
      let paymentsAndDetails: IPaymentsAndPurchases[] = [];
      for (let x = 0; x < allPurchasesForUser.length; x++) {
        const element = allPurchasesForUser[x];
        if (paymentsAndDetails.length === 0) {
          // paymentsAndDetails;
          paymentsAndDetails.push({
            paymentsId: element.payments_id,
            purchaseDate: element.purchase_date,
            purchaseMadeByWrestlerName: wrestlerName,
            purchaseMadeByUserId: element.user_id,
            allPurchasesMadeForThisPayment: [element],
          });
        } else {
          for (let y = 0; y < paymentsAndDetails.length; y++) {
            const paymentDetails = paymentsAndDetails[y];
            if (element.payments_id === paymentDetails.paymentsId) {
              paymentDetails.allPurchasesMadeForThisPayment.push(element);
              break;
            }
            if (y + 1 === paymentsAndDetails.length) {
              // end of loop
              paymentsAndDetails.push({
                paymentsId: element.payments_id,
                purchaseDate: element.purchase_date,
                purchaseMadeByWrestlerName: wrestlerName,
                purchaseMadeByUserId: element.user_id,
                allPurchasesMadeForThisPayment: [element],
              });
              break;
            }
          }
        }
      }
      // console.log(paymentsAndDetails);
      res.status(200).json(paymentsAndDetails);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

//V2
router.post(
  "/getAllPaymentsForUserId",
  hasValidAdminToken,
  async (req, res) => {
    let wrestlerId = req.body.wrestlerId;
    let dateFrom = moment(req.body.dateFrom).toDate();
    let dateTo = moment(req.body.dateTo).toDate();
    try {
      let paymentsForUser = await db.payments.getPaymentsForUser(
        wrestlerId,
        dateFrom,
        dateTo
      );
      console.log({ paymentsForUser });
      res.status(200).json(paymentsForUser);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.post(
  "/getAllPaymentsAndDetailsForAllInTenantWithInTimeFrame",
  hasValidAdminToken,
  async (req, res) => {
    let dateFrom = moment(req.body.dateFrom).toDate();
    let dateTo = moment(req.body.dateTo).toDate();
    console.log({ dateFrom });
    console.log({ dateTo });
    try {
      let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
      let tokenVerify: any = verify(token, config.jwt.secret);
      let tenantId = tokenVerify.tenant;
      let allPurchasesForTenant: ITransactionWithInfo[] =
        await db.transactions.getAllPaymentTransactionsWithDetailsForTenantWithInTimeFrame(
          tenantId,
          dateFrom,
          dateTo
        );
      console.log(allPurchasesForTenant);
      let allPurchasesAndDetailsForEachUserInTenant: IPaymentsAndPurchasesForMultiUsers[] =
        [];
      for (let x = 0; x < allPurchasesForTenant.length; x++) {
        const purchaseFromDb = allPurchasesForTenant[x];
        let purchaseMadeByName = `${
          purchaseFromDb.purchase_made_by_first_name
            ? purchaseFromDb.purchase_made_by_first_name
            : "-"
        } ${
          purchaseFromDb.purchase_made_by_last_name
            ? purchaseFromDb.purchase_made_by_last_name
            : "-"
        }`;
        if (allPurchasesAndDetailsForEachUserInTenant.length === 0) {
          allPurchasesAndDetailsForEachUserInTenant.push({
            purchaseMadeByUserId: purchaseFromDb.user_id,
            purchaseMadeByWrestlerName: purchaseMadeByName,
            purchasesAndPaymentsMade: [
              {
                paymentsId: purchaseFromDb.payments_id,
                purchaseDate: purchaseFromDb.purchase_date,
                purchaseMadeByWrestlerName: purchaseMadeByName,
                purchaseMadeByUserId: purchaseFromDb.user_id,
                allPurchasesMadeForThisPayment: [purchaseFromDb],
              },
            ],
          });
          continue;
        } else {
          for (
            let y = 0;
            y < allPurchasesAndDetailsForEachUserInTenant.length;
            y++
          ) {
            const wrestlerPayments =
              allPurchasesAndDetailsForEachUserInTenant[y];
            if (
              wrestlerPayments.purchaseMadeByUserId === purchaseFromDb.user_id
            ) {
              for (
                let z = 0;
                z < wrestlerPayments.purchasesAndPaymentsMade.length;
                z++
              ) {
                const purchaseMadeByUser =
                  wrestlerPayments.purchasesAndPaymentsMade[z];

                if (
                  purchaseFromDb.payments_id === purchaseMadeByUser.paymentsId
                ) {
                  purchaseMadeByUser.allPurchasesMadeForThisPayment.push(
                    purchaseFromDb
                  );
                  break;
                }
                if (
                  z + 1 ===
                  wrestlerPayments.purchasesAndPaymentsMade.length
                ) {
                  // end of loop
                  wrestlerPayments.purchasesAndPaymentsMade.push({
                    paymentsId: purchaseFromDb.payments_id,
                    purchaseDate: purchaseFromDb.purchase_date,
                    purchaseMadeByWrestlerName: purchaseMadeByName,
                    purchaseMadeByUserId: purchaseFromDb.user_id,
                    allPurchasesMadeForThisPayment: [purchaseFromDb],
                  });
                  break;
                }
              }
              break;
            }
            if (y + 1 === allPurchasesAndDetailsForEachUserInTenant.length) {
              console.log(purchaseFromDb.user_id);
              // user not added to array yet, add them here
              allPurchasesAndDetailsForEachUserInTenant.push({
                purchaseMadeByUserId: purchaseFromDb.user_id,
                purchaseMadeByWrestlerName: purchaseMadeByName,
                purchasesAndPaymentsMade: [
                  {
                    paymentsId: purchaseFromDb.payments_id,
                    purchaseDate: purchaseFromDb.purchase_date,
                    purchaseMadeByWrestlerName: purchaseMadeByName,
                    purchaseMadeByUserId: purchaseFromDb.user_id,
                    allPurchasesMadeForThisPayment: [purchaseFromDb],
                  },
                ],
              });
              break;
            }
          }
        }
      }
      // console.log({ allPurchasesAndDetailsForEachUserInTenant });
      // console.log(
      //   allPurchasesAndDetailsForEachUserInTenant[0].purchasesAndPaymentsMade[0]
      // );
      res.status(200).json(allPurchasesAndDetailsForEachUserInTenant);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.post(
  "/getAllPaymentsForAllInTenantWithInTimeFrame",
  hasValidAdminToken,
  async (req, res) => {
    let dateFrom = moment(req.body.dateFrom).toDate();
    let dateTo = moment(req.body.dateTo).toDate();

    try {
      let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
      let tokenVerify: any = verify(token, config.jwt.secret);
      let tenantId = tokenVerify.tenant;
      let allPurchasesForTenant: IPayment[] =
        await db.payments.getAllPaymentsForTenantWithinTimeFrame(
          tenantId,
          dateFrom,
          dateTo
        );
      console.log({ allPurchasesForTenant });

      res.status(200).json(allPurchasesForTenant);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

export default router;

// let example = { payments_id: 5, wrestlerName: "john", purchases: {}[] }[]
// let example2 = = {  5(pa_id):, wrestlerName: "john", purchases: {}[] };
// let example2 = {
//   5: { wrestlerName: "string", purchases: [{}, {}] },
//   3: { wrestlerName: "string", purchases: [{}, {}] },
// };
