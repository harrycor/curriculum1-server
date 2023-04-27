import { application, Router } from "express";
import db from "../db";
import config from "../config";
import * as moment from "moment";
import {
  IRecurringPaymentContractWithUnit,
  IStripeCustomer,
} from "../../types";
import checkRecurringPaymentStatuses from "../functionsForAutomation/checkRecurringPaymentStatusesFunction";
const stripe = require("stripe")(config.stripe.secret);

const router = Router();

//   another edge case. WH can hit before the initial payment and purchase is created casing it to n ot be existing.. WH should just try again but at this point we say the contract payment is processing se avoid a double charge from the contract automation  can i get the PI id before sending the charge through i will look into this
router.post("/checkRecurringPaymentContractsStatus", async (req, res) => {
  try {
    res.status(200).json(await checkRecurringPaymentStatuses());
    return;

    let todaysDate = moment().toDate();
    // let todaysDate = moment().add(4, "months").toDate();
    // get all contracts
    let allRecurringPaymentContractThatNeedPayment: IRecurringPaymentContractWithUnit[] =
      await db.recurringPaymentContracts.selectAllContractsThatNeedPayment(
        todaysDate
      );
    console.log(allRecurringPaymentContractThatNeedPayment);
    for (
      let x = 0;
      x < allRecurringPaymentContractThatNeedPayment.length;
      x++
    ) {
      let {
        id,
        user_id,
        tenant_id,
        name_of_item,
        item_type_id,
        number_of_items_included,
        total_price_of_service_or_merchandise,
        date_units_id_for_expiration,
        number_of_date_units_for_expiration,
        keep_track_of_amount_used,
        is_a_private_lesson,
        is_a_practice,
        is_unlimited,
      } = allRecurringPaymentContractThatNeedPayment[x];
      let applicationFee = await calculateApplicationFeeAmount(
        total_price_of_service_or_merchandise
      );
      // use the tenant id to get adn verify connect account
      let stripeAccountInfoByTenantId =
        await db.stripeAccounts.getStripeAccountInfoByTenantId(tenant_id);
      const account = await stripe.accounts.retrieve(
        stripeAccountInfoByTenantId[0].stripe_account_id
      );
      //  get user PM from stripe customers table
      let [userStripeCustomerInfo]: IStripeCustomer[] =
        await db.stripeCustomers.getStripeCustomerByUserId(user_id);
      console.log(userStripeCustomerInfo);
      let stripeCustomerId = userStripeCustomerInfo.stripe_customer_id;
      let stripePaymentMethod =
        userStripeCustomerInfo.stripe_payment_method_id_for_recurring_payments;
      // create stripe payment intents
      const paymentIntent = await stripe.paymentIntents.create(
        {
          amount: total_price_of_service_or_merchandise * 100,
          currency: "usd",
          application_fee_amount: applicationFee,
          customer: stripeCustomerId,
          payment_method: stripePaymentMethod,
          confirm: true,
          description: "WrestlingTournaments.com",
        },
        { stripeAccount: account.id }
      );
      console.log(paymentIntent);
      //   update contract recurring_payment_status to true so we don't double charge just in case. what if this payment fails... then we will never attempt again edge case here
      // I should really do this at the very top. but if the creat payment intents fails we will never try o charge them again
      await db.recurringPaymentContracts.updateRecurringPaymentContractRecurringPaymentProcessingStats(
        id,
        1
      );
      //   it really should only proceed if PI was successfully created but I am in a hurry
      // insert initial payment info
      let initialPaymentInsert: { insertId: number } | any = //fuck you TS
        await db.payments.initialPaymentInsert(
          user_id,
          paymentIntent.id,
          account.id
        );
      let paymentsId = initialPaymentInsert.insertId;
      //   insert initial purchase info
      //   another edge case. WH can hit before the initial payment and purchase is created casing it to n ot be existing.. WH should just try again but at this point we say the contract payment is processing se avoid a double charge from the contract automation
      await db.purchases.initialInsert(
        user_id,
        tenant_id,
        name_of_item,
        item_type_id,
        number_of_items_included,
        total_price_of_service_or_merchandise,
        paymentsId,
        is_a_private_lesson,
        date_units_id_for_expiration,
        number_of_date_units_for_expiration,
        keep_track_of_amount_used,
        id,
        is_a_practice,
        is_unlimited
      );
    }
    // if contract needs payment we get the PM from the stripe customer table  with the user_id on contract
    // build a purchase and attempt a charge
    //check if they need to be charged
    res.status(200).json({
      message:
        "Recurring billing contracts have been checked for needed payment",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to check recurring billing contracts" });
  }
});

export default router;

let calculateApplicationFeeAmount = async (itemCost: number) => {
  // let applicationFee = `${((3.5 / 100) * itemCost + 0.3) * 100}`;
  // return applicationFee.split(".")[0];
  return 200;
};
