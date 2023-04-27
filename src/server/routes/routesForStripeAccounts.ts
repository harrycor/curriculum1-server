import db from "../db";
import config from "../config";
import * as express from "express";
import { Router } from "express";
import { hasValidAdminToken, hasValidCoachToken } from "../utils/tokenCheck";
import { verify } from "jsonwebtoken";
import {
  IServicesAndMerchandiseWithItemTypeInfo,
  IStripeCustomer,
} from "../../types";
import { ICart } from "../../client/payments/interfacesForPayments";
const stripe = require("stripe")(config.stripe.secret);

const router = Router();

let refresheturnURL =
  "https://www.wrestlingcurriculum.com/servicesAndMerchandise";

//   GET
router.get("/getStoreAvailability", async (req, res) => {
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let stripeAccountInfoByTenantId =
      await db.stripeAccounts.getStripeAccountInfoByTenantId(
        tokenVerify.tenant
      );
    if (stripeAccountInfoByTenantId[0] === undefined) {
      //no account
      console.log("no account");
      res.status(200).json({
        tokenVerify,
      });
    } else {
      // has account
      //check account status
      console.log("has account");
      const account = await stripe.accounts.retrieve(
        stripeAccountInfoByTenantId[0].stripe_account_id
      );
      // console.log(account);
      if (account.details_submitted) {
        if (
          account.capabilities.card_payments === "active" &&
          account.capabilities.transfers === "active"
        ) {
          // store ready
          console.log("card enabled");
          res.status(200).json({
            tokenVerify,
            tenantHasStripeAccount: true,
            detailsSubmitted: true,
            cardPaymentsAndTranfersActive: true,
            stripeAccountType:
              stripeAccountInfoByTenantId[0].stripe_account_type,
          });
        } else {
          // details submitted but card tranfers need to be setup. not store ready
          console.log("details submitted cards not setup");
          res.status(200).json({
            tokenVerify,
            tenantHasStripeAccount: true,
            detailsSubmitted: true,
            stripeAccountType:
              stripeAccountInfoByTenantId[0].stripe_account_type,
          });
        }
      } else {
        res.status(200).json({
          tokenVerify,
          tenantHasStripeAccount: true,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get("/getStripeAccountStatusForCalendar", async (req, res) => {
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let stripeAccountInfoByTenantId =
      await db.stripeAccounts.getStripeAccountInfoByTenantId(
        tokenVerify.tenant
      );
    if (stripeAccountInfoByTenantId[0] === undefined) {
      //no account
      console.log("no account cal");
      res.status(200).json({
        isStripeAccountActive: false,
      });
    } else {
      // has account
      //check account status
      console.log("has account cal");
      const account = await stripe.accounts.retrieve(
        stripeAccountInfoByTenantId[0].stripe_account_id
      );
      if (account.details_submitted) {
        // has account anc details filled
        res.status(200).json({ isStripeAccountActive: true });
      } else {
        // has account but has not provided details
        res.status(200).json({ isStripeAccountActive: false });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ isStripeAccountActive: false });
  }
});

router.get("/getStripeAccountStatusForAccount", async (req, res) => {
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let stripeAccountInfoByTenantId =
      await db.stripeAccounts.getStripeAccountInfoByTenantId(
        tokenVerify.tenant
      );
    if (stripeAccountInfoByTenantId[0] === undefined) {
      //no account
      console.log("no account from account page");
      res.status(200).json({
        isStripeAccountActive: false,
      });
    } else {
      // has account
      //check account status
      console.log("has account from accounts page");
      const account = await stripe.accounts.retrieve(
        stripeAccountInfoByTenantId[0].stripe_account_id
      );
      if (account.details_submitted) {
        // has account anc details filled
        res.status(200).json({ isStripeAccountActive: true });
      } else {
        // has account but has not provided details
        res.status(200).json({ isStripeAccountActive: false });
      }
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get("/getConnectAccountId", async (req, res) => {
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let stripeAccountInfoByTenantId =
      await db.stripeAccounts.getStripeAccountInfoByTenantId(
        tokenVerify.tenant
      );
    res.status(200).json(stripeAccountInfoByTenantId);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// POST
router.post("/createStripeAccount", hasValidAdminToken, async (req, res) => {
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    const account = await stripe.accounts.create({
      type: "express",
      capabilities: {
        //this is so we can make charges to them an tranfer our cut to us
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
    await db.stripeAccounts.createStripeAccount(
      tokenVerify.tenant,
      tokenVerify.userId,
      account.id,
      account.type
    );
    console.log("account made and info stored in our DB");
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: refresheturnURL,
      return_url: refresheturnURL,
      type: "account_onboarding",
    });
    res.status(200).json(accountLink.url);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post(
  "/completeOrUpdateAccountDetails",
  hasValidAdminToken,
  async (req, res) => {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let stripeAccountInfo =
      await db.stripeAccounts.getStripeAccountInfoByTenantId(
        tokenVerify.tenant
      );
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountInfo[0].stripe_account_id,
      refresh_url: refresheturnURL,
      return_url: refresheturnURL,
      type: "account_onboarding",
    });
    res.status(200).json(accountLink.url);
    try {
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.post("/createPaymentIntent", async (req, res) => {
  /*  note: this can be made much better and cleaner. We are rushing so these things happen.
    currently this is a mess but has the potential to cleaned up and organized*/
  let cartItemsIdNumbersAndQuantities: Array<{
    serviceOrMerchandiseId: number;
    quantity: number;
  }> = req.body.cartItemsIdNumbersAndQuantities;
  let email = req.body.email;
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
    let tokenVerify: any = verify(token, config.jwt.secret);
    let tenantId = tokenVerify.tenant;
    let userId = tokenVerify.userId;
    // get total cost
    let cartTotal = await calculateCartTotal(cartItemsIdNumbersAndQuantities);
    // gets and verifies stripe connect account id
    // get application fee amount
    let applicationFeeAmount = await calculateApplicationFeeAmount(
      cartItemsIdNumbersAndQuantities
    );
    // console.log(cartTotal);
    // console.log(applicationFeeAmount);
    let stripeAccountInfoByTenantId =
      await db.stripeAccounts.getStripeAccountInfoByTenantId(tenantId);
    const account = await stripe.accounts.retrieve(
      stripeAccountInfoByTenantId[0].stripe_account_id
    );
    // create array of service or merchandise Id's from cart
    let arrayOfServiceOrMerchandiseIdsFromCart: number[] =
      await getArrayOrServicesOrMerchandiseIdsFromCartInfo(
        cartItemsIdNumbersAndQuantities
      );
    // get all services and merchandise with item type info from array of Ids
    let allServicesAndMerchandiseInCart: IServicesAndMerchandiseWithItemTypeInfo[] =
      await db.servicesAndMerchandise.getAllServicesOrMerchandiseFromArrayOfIds(
        arrayOfServiceOrMerchandiseIdsFromCart
      );
    // put quantity of items on each item in object
    for (let a = 0; a < allServicesAndMerchandiseInCart.length; a++) {
      let serviceOrMerchandiseId = allServicesAndMerchandiseInCart[a].id;
      for (let b = 0; b < cartItemsIdNumbersAndQuantities.length; b++) {
        let cartItemId =
          cartItemsIdNumbersAndQuantities[b].serviceOrMerchandiseId;
        let cartItemQuantity = cartItemsIdNumbersAndQuantities[b].quantity;
        if (cartItemId === serviceOrMerchandiseId) {
          allServicesAndMerchandiseInCart[a].quantity = cartItemQuantity;
          continue;
        }
      }
    }
    // get services and merchandise with item type info from array of Ids that contain **contracts**
    let allServicesAndMerchandiseInCarThatHaveContracts =
      await db.servicesAndMerchandise.getAllServicesAndMerchandiseWithRecurringPaymentContractFromIds(
        arrayOfServiceOrMerchandiseIdsFromCart
      );
    // create paymentIntents object to pass into stripe
    let paymentIntentObject: any = {
      amount: cartTotal,
      currency: "usd",
      application_fee_amount: applicationFeeAmount,
      receipt_email: email,
      automatic_payment_methods: {
        enabled: true,
      },
      description: "WrestlingTournaments.com",
      // application_fee_amount: 200,
    };
    // check if any items in cart contain contracts
    if (allServicesAndMerchandiseInCarThatHaveContracts.length > 0) {
      // check if stripe customer exists in our db
      let stripeCustomerInfo: IStripeCustomer[] =
        await db.stripeCustomers.getStripeCustomerByUserId(userId);
      if (stripeCustomerInfo[0]) {
        // if stripe customer exists attach it to stripe payment intents object
        // i have to use payment method if exists? not checking ofr that
        paymentIntentObject.customer = stripeCustomerInfo[0].stripe_customer_id;
      } else {
        // get users name from personal info
        let usersPersonalInfo: { first_name: string; last_name: string }[] =
          await db.personal_info.singlePerson(userId);
        // console.log(usersPersonalInfo);
        let usersName =
          usersPersonalInfo[0] !== undefined
            ? `${usersPersonalInfo[0].first_name} ${usersPersonalInfo[0].last_name}`
            : "-";
        // else create stripe customer
        const customer = await stripe.customers.create(
          { name: usersName, email },
          {
            stripeAccount: account.id,
          }
        );
        // store stripe customer in db
        await db.stripeCustomers.insertInitialNewStripeCustomer(
          userId,
          customer.id
        );
        // attach new stripe customer to stripe payments intents object
        paymentIntentObject.customer = customer.id;
      }
      // attach setup future payments to stripe payment intents object to save payment under customer
      paymentIntentObject.setup_future_usage = "off_session"; //currently doing this even if they haev a PM set up until i figure out how to ask if they want to pay with current PM or use another credntial
      // paymentIntentObject.confirm = true;
    }
    // console.log(paymentIntentObject);
    // create stripe payment intents
    // console.log(paymentIntentObject);
    const paymentIntent = await stripe.paymentIntents.create(
      paymentIntentObject,
      {
        stripeAccount: account.id,
      }
    );
    // console.log(paymentIntent);

    // insert initial payment info
    let initialPaymentInsert: { insertId: number } | any = //fuck you TS
      await db.payments.initialPaymentInsert(
        userId,
        paymentIntent.id,
        account.id
      );
    // initial payment insert Id
    let paymentsId = initialPaymentInsert.insertId;
    // for loop to create initial contracts/purchases insert for each service/item in cart
    for (let x = 0; x < allServicesAndMerchandiseInCart.length; x++) {
      // set contract id to null
      let recurringPaymentContractId = null;
      // destructure
      let {
        name_of_item,
        item_type_id,
        number_of_items_included,
        cost_of_item,
        is_a_private_lesson,
        date_units_id_for_expiration,
        number_of_date_units_for_expiration,
        keep_track_of_amount_used,
        has_recurring_payment_contract,
        is_a_practice,
        is_unlimited,
        quantity,
      } = allServicesAndMerchandiseInCart[x];
      console.log(is_a_practice);
      // loop though quantity to make number of initial inserts the same as the quantity selected by user
      for (let y = 0; y < quantity!; y++) {
        if (has_recurring_payment_contract === 1) {
          // service/item has recurringPaymentContractId create contract and set contract id to insert id
          // create contract and get insert ID
          let initialContractInsert: { insertId: number } | any =
            await db.recurringPaymentContracts.initialContractInsert(
              userId,
              tenantId,
              name_of_item,
              item_type_id,
              number_of_items_included,
              cost_of_item,
              is_a_private_lesson,
              date_units_id_for_expiration,
              number_of_date_units_for_expiration,
              keep_track_of_amount_used,
              is_a_practice,
              is_unlimited
            );
          // set recurring contract insert id in variable
          recurringPaymentContractId = initialContractInsert.insertId;
        }
        // initial purchase insert
        await db.purchases.initialInsert(
          userId,
          tenantId,
          name_of_item,
          item_type_id,
          number_of_items_included,
          cost_of_item,
          paymentsId,
          is_a_private_lesson,
          date_units_id_for_expiration,
          number_of_date_units_for_expiration,
          keep_track_of_amount_used,
          recurringPaymentContractId,
          is_a_practice,
          is_unlimited
        );
      }
    }
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.post(
  "/createPaymentIntentAdmin",
  hasValidAdminToken,
  async (req, res) => {
    /*  note: this can be made much better and cleaner. We are rushing so these things happen.
    currently this is a mess but has the potential to cleaned up and organized*/
    // let cartItemsIdNumbersAndQuantities: Array<{
    //   serviceOrMerchandiseId: number;
    //   quantity: number;
    // }> = req.body.cartItemsIdNumbersAndQuantities;
    let cartItems: ICart[] = req.body.cartItems;
    let email = req.body.email;
    let userId = req.body.userId;
    let applicationFeeAmount = 200;
    console.log(req.body);
    try {
      let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
      let tokenVerify: any = verify(token, config.jwt.secret);
      let tenantId = tokenVerify.tenant;
      let adminUserId = tokenVerify.userId;
      // get total cost
      let cartTotal = await calculateCartTotalAdmin(cartItems);
      console.log(cartTotal);
      // gets and verifies stripe connect account id
      // get application fee amount
      // let applicationFeeAmount = await calculateApplicationFeeAmount(
      //   cartItemsIdNumbersAndQuantities
      // );
      // console.log(cartTotal);
      // console.log(applicationFeeAmount);
      let stripeAccountInfoByTenantId =
        await db.stripeAccounts.getStripeAccountInfoByTenantId(tenantId);
      const account = await stripe.accounts.retrieve(
        stripeAccountInfoByTenantId[0].stripe_account_id
      );
      // create array of service or merchandise Id's from cart
      let arrayOfServiceOrMerchandiseIdsFromCart: number[] =
        await getArrayOrServicesOrMerchandiseIdsFromCartInfoFromAdmin(
          cartItems
        );
      // get all services and merchandise with item type info from array of Ids
      let allServicesAndMerchandiseInCart: IServicesAndMerchandiseWithItemTypeInfo[] =
        await db.servicesAndMerchandise.getAllServicesOrMerchandiseFromArrayOfIds(
          arrayOfServiceOrMerchandiseIdsFromCart
        );
      // put quantity of items on each item in object
      // put items into object:
      // --cost_of_item, date_units_id_for_expiration, number_of_date_units_for_expiration, unit, quantity
      for (let a = 0; a < allServicesAndMerchandiseInCart.length; a++) {
        let serviceOrMerchandiseId = allServicesAndMerchandiseInCart[a].id;
        for (let b = 0; b < cartItems.length; b++) {
          let cartItemId = cartItems[b].id;
          let cartItemQuantity = cartItems[b].quantity;
          let cartItemCostOfItem = cartItems[b].cost_of_item;
          let cartDateUnitsId = cartItems[b].date_units_id_for_expiration;
          let cartNumberOfDateUnits =
            cartItems[b].number_of_date_units_for_expiration;
          if (cartItemId === serviceOrMerchandiseId) {
            allServicesAndMerchandiseInCart[a].quantity = cartItemQuantity;
            allServicesAndMerchandiseInCart[a].cost_of_item =
              cartItemCostOfItem;
            allServicesAndMerchandiseInCart[a].date_units_id_for_expiration =
              cartDateUnitsId;
            allServicesAndMerchandiseInCart[
              a
            ].number_of_date_units_for_expiration = cartNumberOfDateUnits;
            continue;
          }
        }
      }
      // get services and merchandise with item type info from array of Ids that contain **contracts**
      let allServicesAndMerchandiseInCarThatHaveContracts =
        await db.servicesAndMerchandise.getAllServicesAndMerchandiseWithRecurringPaymentContractFromIds(
          arrayOfServiceOrMerchandiseIdsFromCart
        );
      // create paymentIntents object to pass into stripe
      let paymentIntentObject: any = {
        amount: cartTotal,
        currency: "usd",
        application_fee_amount: applicationFeeAmount,
        receipt_email: email,
        automatic_payment_methods: {
          enabled: true,
        },
        description: "WrestlingTournaments.com",
        // application_fee_amount: 200,
      };
      // check if any items in cart contain contracts
      if (allServicesAndMerchandiseInCarThatHaveContracts.length > 0) {
        // check if stripe customer exists in our db
        let stripeCustomerInfo: IStripeCustomer[] =
          await db.stripeCustomers.getStripeCustomerByUserId(userId);
        if (stripeCustomerInfo[0]) {
          // if stripe customer exists attach it to stripe payment intents object
          // i have to use payment method if exists? not checking ofr that
          paymentIntentObject.customer =
            stripeCustomerInfo[0].stripe_customer_id;
        } else {
          // get users name from personal info
          let usersPersonalInfo: { first_name: string; last_name: string }[] =
            await db.personal_info.singlePerson(userId);
          // console.log(usersPersonalInfo);
          let usersName =
            usersPersonalInfo[0] !== undefined
              ? `${usersPersonalInfo[0].first_name} ${usersPersonalInfo[0].last_name}`
              : "-";
          // else create stripe customer
          const customer = await stripe.customers.create(
            { name: usersName, email },
            {
              stripeAccount: account.id,
            }
          );
          // store stripe customer in db
          await db.stripeCustomers.insertInitialNewStripeCustomer(
            userId,
            customer.id
          );
          // attach new stripe customer to stripe payments intents object
          paymentIntentObject.customer = customer.id;
        }
        // attach setup future payments to stripe payment intents object to save payment under customer
        paymentIntentObject.setup_future_usage = "off_session"; //currently doing this even if they haev a PM set up until i figure out how to ask if they want to pay with current PM or use another credntial
        // paymentIntentObject.confirm = true;
      }
      // console.log(paymentIntentObject);
      // create stripe payment intents
      // console.log(paymentIntentObject);
      const paymentIntent = await stripe.paymentIntents.create(
        paymentIntentObject,
        {
          stripeAccount: account.id,
        }
      );
      // console.log(paymentIntent);

      // insert initial payment info
      let initialPaymentInsert: { insertId: number } | any = //fuck you TS
        await db.payments.initialPaymentInsertWithInsertByAdminUserIdIfAny(
          userId,
          paymentIntent.id,
          account.id,
          adminUserId
        );
      // initial payment insert Id
      let paymentsId = initialPaymentInsert.insertId;
      // for loop to create initial contracts/purchases insert for each service/item in cart
      for (let x = 0; x < allServicesAndMerchandiseInCart.length; x++) {
        // set contract id to null
        let recurringPaymentContractId = null;
        // destructure
        let {
          name_of_item,
          item_type_id,
          number_of_items_included,
          cost_of_item,
          is_a_private_lesson,
          date_units_id_for_expiration,
          number_of_date_units_for_expiration,
          keep_track_of_amount_used,
          has_recurring_payment_contract,
          is_a_practice,
          is_unlimited,
          quantity,
        } = allServicesAndMerchandiseInCart[x];
        console.log(is_a_practice);
        // loop though quantity to make number of initial inserts the same as the quantity selected by user
        for (let y = 0; y < quantity!; y++) {
          if (has_recurring_payment_contract === 1) {
            // service/item has recurringPaymentContractId create contract and set contract id to insert id
            // create contract and get insert ID
            let initialContractInsert: { insertId: number } | any =
              await db.recurringPaymentContracts.initialContractInsertWithAdminUserIdInsert(
                userId,
                tenantId,
                name_of_item,
                item_type_id,
                number_of_items_included,
                cost_of_item,
                is_a_private_lesson,
                date_units_id_for_expiration,
                number_of_date_units_for_expiration,
                keep_track_of_amount_used,
                is_a_practice,
                is_unlimited,
                adminUserId
              );
            // set recurring contract insert id in variable
            recurringPaymentContractId = initialContractInsert.insertId;
          }
          // initial purchase insert
          await db.purchases.initialInsert(
            userId,
            tenantId,
            name_of_item,
            item_type_id,
            number_of_items_included,
            cost_of_item,
            paymentsId,
            is_a_private_lesson,
            date_units_id_for_expiration,
            number_of_date_units_for_expiration,
            keep_track_of_amount_used,
            recurringPaymentContractId,
            is_a_practice,
            is_unlimited
          );
        }
      }
      res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

router.post("/offsessiontest", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: 505 * 100,
        currency: "usd",
        payment_method: "pm_1MOm9zR3aZhlIEtoj4lWd6sb",
        // receipt_email: email,
        // automatic_payment_methods: {
        //   enabled: true,
        // },
        confirm: true,
        // setup_future_usage: "off_session",
        customer: "cus_N94HargVK0wplA",
        description: "WrestlingTournaments.com",
        // application_fee_amount: 200,
      },
      {
        stripeAccount: "acct_1M59cVR3aZhlIEto",
      }
    );
    console.log(paymentIntent);
    res.sendStatus(200);

    // this is to save users payment info with stripe so we can bill them accordingly
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//subs and recurring payemtns
//for memebership and setipintents;
//create stripe cust
//create setupintents with cust id
//add and attach setupintents id to cust

router.post("/createStripeConnectCustomer", async (req, res) => {
  try {
    const customer = await stripe.customers.create(
      {
        description: "My First Test Customer",
      },
      { stripeAccount: "acct_1M59cVR3aZhlIEto" }
    );
    console.log(customer);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post("/createSetupIntentForCustomer", async (req, res) => {
  try {
    // this is to save users payment info with stripe so we can bill them accordingly
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post("/retrieveCustomer", async (req, res) => {
  try {
    // this is to save users payment info with stripe so we can bill them accordingly
    const customer = await stripe.customers.retrieve("cus_N94HargVK0wplA", {
      stripeAccount: "acct_1M59cVR3aZhlIEto",
    });
    console.log(customer);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.post("/getpmethods", async (req, res) => {
  try {
    // this is to save users payment info with stripe so we can bill them accordingly
    const paymentMethods = await stripe.paymentMethods.list(
      {
        customer: "cus_N94HargVK0wplA",
        // type: 'card',
      },
      { stripeAccount: "acct_1M59cVR3aZhlIEto" }
    );
    console.log(paymentMethods);
    console.log(paymentMethods.data[0].card);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// router.post("/createStripeProduct", hasValidAdminToken, async (req, res) => {
//   let productName = req.body.productName;
//   let productPrice = Number(req.body.productPrice) * 100;
//   let recurringInterval = req.body.recurringInterval;
//   try {
//     let token: any = req.headers.authorization?.split(" ")[1]; // removes bearer from the string
//     let tokenVerify: any = verify(token, config.jwt.secret);
//     let stripeAccountInfo =
//       await db.stripeAccounts.getStripeAccountInfoByTenantId(
//         tokenVerify.tenant
//       );
//     let stripeConnectAccountId = stripeAccountInfo[0].stripe_account_id;
//     // create a stripe product
//     let product = await stripe.products.create(
//       {
//         name: productName,
//       },
//       { stripeAccount: stripeConnectAccountId }
//     );
//     // console.log(product.id);
//     // create stripe price
//     let price = await stripe.prices.create(
//       {
//         unit_amount: productPrice,
//         currency: "usd",
//         recurring: { interval: recurringInterval },
//         product: product.id,
//       },
//       { stripeAccount: stripeConnectAccountId }
//     );
//     console.log(price);
//     res.sendStatus(200);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// });

// router.post("/createStripePrice", async (req, res) => {
//   try {
//     let price = await stripe.prices.create(
//       {
//         unit_amount: "1000",
//         currency: "usd",
//         recurring: { interval: "week" },
//         product: "prod_MonbmQYQmD1PK6",
//       },
//       { stripeAccount: "acct_1M59cVR3aZhlIEto" }
//     );
//     console.log(price);
//     res.sendStatus(200);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// });

// router.post("/createStripeSubscription", async (req, res) => {
//   try {
//     const subscription = await stripe.subscriptions.create(
//       {
//         customer: "cus_MopUIp4IEgOOpS",
//         items: [{ price: "price_1M5Bh9R3aZhlIEto1VRmTXaO" }],
//       },
//       { stripeAccount: "acct_1M59cVR3aZhlIEto" }
//     );
//     console.log(subscription);
//     res.sendStatus(200);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// });

export default router;

let calculateApplicationFeeAmount = async (
  cartItemsIdNumbersAndQuantities: Array<{
    serviceOrMerchandiseId: number;
    quantity: number;
  }>
) => {
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
  let applicationFee = `${((3.5 / 100) * cartTotal + 0.3) * 100}`;
  // return applicationFee.split(".")[0];
  return 200;
};

let calculateCartTotal = async (
  cartItemsIdNumbersAndQuantities: Array<{
    serviceOrMerchandiseId: number;
    quantity: number;
  }>
) => {
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
  return cartTotal * 100;
};

let calculateCartTotalAdmin = async (cartItems: ICart[]) => {
  let cartTotal: number = 0;
  console.log({ cartItems });
  for (let x = 0; x < cartItems.length; x++) {
    cartTotal = cartTotal + cartItems[x].cost_of_item * cartItems[x].quantity;
  }
  return cartTotal * 100;
};

let getArrayOrServicesOrMerchandiseIdsFromCartInfo = async (
  cartItemsIdNumbersAndQuantities: Array<{
    serviceOrMerchandiseId: number;
    quantity: number;
  }>
) => {
  let arrayOfIds: number[] = [];
  for (let x = 0; x < cartItemsIdNumbersAndQuantities.length; x++) {
    arrayOfIds.push(cartItemsIdNumbersAndQuantities[x].serviceOrMerchandiseId);
  }
  return arrayOfIds;
};

let getArrayOrServicesOrMerchandiseIdsFromCartInfoFromAdmin = async (
  cartItems: ICart[]
) => {
  let arrayOfIds: number[] = [];
  for (let x = 0; x < cartItems.length; x++) {
    arrayOfIds.push(cartItems[x].id);
  }
  return arrayOfIds;
};
