import db from "../db";
import config from "../config";
import * as moment from "moment";
import * as express from "express";
import { Router } from "express";
import { createElement } from "react";
import {
  IPayment,
  IPurchase,
  IPurchaseWithUnit,
  IRecurringPaymentContractWithUnit,
} from "../../types";
const stripe = require("stripe")(config.stripe.secret);
// const endpointSecret = "whsec_pnakRgAGzPRutskVeIpxk3a1xXrXnT5S";
const endpointSecret = config.stripe.connectWebhookEndpointSecret;
const router = Router();

// currently this webhook shares creation of accounts and when a purchase is made handle the differences or make a new hook URL

/*
***CONCERN: I am worried that we will eventually reach a limit of how many payment methods we can store in each customer,
I could not find a limit that exists anywhere on the inter web
-one option is to remove the previous (or any existing) PM once a new one is added, Im sure there is a way to
present the customer with a choice of PM if there is one on file but that will take longer then just removing 
the current PM and updating it with new one.
we currently just keep adding a new PM to the customer each time they CHECKOUT with a new contract
(keeps the same customer ID, but add a new PM for the recurring payment).
Also, stripe allows you
to set a customer default PM if one is saved but we use the most previous PM as their default PM
because that is the one we store in our DB with the stripe customer.
*/

router.post(
  "/webhookForConnectAccountsActivity",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    let createNewPaymentInsertId: any = undefined;
    try {
      const sig = req.headers["stripe-signature"];
      console.log("hooking");
      let event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      // console.log(event);
      // get all info needed off of the stripe webhook event
      let stripePaymentIntentsId = event.data.object.id;
      let stripeEventId = event.id;
      let stripeConnectAccountId = event.account;
      let stripePaymentMethodId = event.data.object.payment_method;
      let stripePaymentIntentName = event.type;
      let stripeChargeId = event.data.object.charges.data[0].id;
      let stripeChargeStatus = event.data.object.charges.data[0].status;
      let stripePurchaseDate = moment(
        event.data.object.charges.data[0].created,
        "X"
      ).toDate();
      console.log(event);
      // get the payment from our DB from the stripe payment intents id
      let [paymentInfo]: IPayment[] =
        await db.payments.selectPaymentByStripePaymentIntentsId(
          stripePaymentIntentsId
        );
      console.log({paymentInfo});
      // guard clause if payment has been created initially(automation payments edge case)
      if (paymentInfo === undefined) {
        console.log("stripe webhook guarded. payment not created yet");
        res.sendStatus(200);
        return;
      }
      // guard clause in case a successful webhook hits more than once. we check if payment is successful in our DB and if it is we return
      if (paymentInfo.charge_status === "succeeded") {
        console.log("stripe webhook guarded payment is already successful");
        res.sendStatus(200);
        return;
      }
      let paymentsId = paymentInfo.id;
      let adminInsertByUserId = paymentInfo.admin_insert_by_user_id;
      // insert stripe event id and stripe charge id and update charge status in our payments table
      await db.payments.updatePaymentWithInfoFromWebhook(
        paymentsId,
        stripeEventId,
        stripeChargeId,
        stripeChargeStatus,
        stripePurchaseDate
      );
      // get all purchases from payments id
      let allPurchasesFromPaymentsId: IPurchaseWithUnit[] =
        await db.purchases.getAllPurchasesByPaymentId(paymentsId);
      // loop through purchases made under this payments id and handle them accordingly
      for (let x = 0; x < allPurchasesFromPaymentsId.length; x++) {
        // destructure
        let {
          id,
          user_id,
          tenant_id,
          item_type_id,
          is_a_private_lesson,
          keep_track_of_amount_used,
          number_of_items_included,
          unit,
          number_of_date_units_for_expiration,
          recurring_payment_contracts_id,
          is_a_practice,
          is_unlimited,
        } = allPurchasesFromPaymentsId[x];
        // set initial deactivation date to null
        let deactivationDateForPurchase: null | Date = null;
        // if there is a deactivation date; calculate it
        if (unit && number_of_date_units_for_expiration) {
          // set new deactivation date
          deactivationDateForPurchase = moment(stripePurchaseDate)
            .add(number_of_date_units_for_expiration, unit)
            .toDate();
        }
        // update purchase information
        await db.purchases.updatePurchaseAfterSuccessfulPayment(
          id,
          stripePurchaseDate,
          deactivationDateForPurchase
        );
        // contract if any
        if (recurring_payment_contracts_id) {
          // update stripe customer payment method id in our db to set as default for recurring payment contract bc a customer should exist at this point. if it get here and there is no customer we fucked up
          await db.stripeCustomers.updateCustomerStripePaymentMethodIdForRecurringPayments(
            stripePaymentMethodId,
            user_id
          );
          let [recurringPaymentContract]: IRecurringPaymentContractWithUnit[] =
            await db.recurringPaymentContracts.selectRecurringPaymentContractById(
              recurring_payment_contracts_id
            );
          // calculate contract start date last payment date and next payment date
          let recurringContractNextPaymentDate = moment(stripePurchaseDate)
            .add(
              recurringPaymentContract.number_of_date_units_for_expiration,
              recurringPaymentContract.unit
            )
            .toDate();
          // update contract (this is the first payment made on the contract bc it has no start date)
          if (recurringPaymentContract.contract_start_date) {
            // contract has had a first successful payment and this is from an automated charge
            await db.recurringPaymentContracts.updateRecurringPaymentContractAfterSuccessfulAutomaticPayment(
              recurring_payment_contracts_id,
              stripePurchaseDate,
              recurringContractNextPaymentDate
            );
          } else {
            // this is the first successful payment on the recurring payment contract
            await db.recurringPaymentContracts.updateRecurringPaymentContractAfterFirstSuccessfulPayment(
              recurring_payment_contracts_id,
              stripePurchaseDate,
              stripePurchaseDate,
              recurringContractNextPaymentDate
            );
          }
        }
        // transactions initial insert
        await db.transactions.initialInsertAfterSuccessfulPayment(
          user_id,
          tenant_id,
          paymentsId,
          id,
          item_type_id,
          is_a_private_lesson === 1 ? 1 : 0,
          keep_track_of_amount_used,
          deactivationDateForPurchase,
          number_of_items_included,
          is_a_practice,
          is_unlimited,
          adminInsertByUserId
        );
      }
      res.sendStatus(200);
      return;
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

export default router;

interface IServicesAndMerchWithItemTypeInfo {
  id: number;
  name_of_item: string;
  cost_of_item: number;
  item_type_id: number;
  number_of_items_included: number;
  added_by_user_id: number;
  tenant_id: number;
  active_duration_in_days?: number;
  date_created: string;
  item_type: string;
  allow_active_duration: number;
  keep_track_of_amount_used: number;
}
