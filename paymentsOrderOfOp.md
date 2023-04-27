### Creating payment intents order of op \***\*\*\*\*\***

- after reviewing cart and proceeding to checkout:

1. Get cart total cost
2. Get and then Verify STRIPE connect account id
3. Get all services/merchandise info for things in cart
4. Put quantities on each service/merchandise
5. Get any services/merchandise contains a recurring payment contract
6. Create initial payment intents object={}
7. If any services/merchandise contain a recurring payment contract:

- 7a.
  Get stripe customer ID by user id if one exists.
  or
  Create new stripe customer and store the stripe customer ID in our db
- 7b.
  Attach both the stripe customer id and "setup_future_usage: off_session" to initial payment intents object

8. Create STRIPE payment intents with initial payment intents object and stripe connect account id; this will return a stripe payment intents ID
9. Create initial payment insert into our DB, storing the stripe payment intents ID

- at this point, we have:

* services/merchandise array with quantity:
  [
  {id:1, name:shirt, cost:10, quantity: 2, ...},
  {id:5, name:private lesson,cost 25,quantity:1, ...},
  ...
  ]
* payments insert ID
* STRIPE payment intents

9. Loop through services/merchandise array:
   - 9a.
     Inner loop through quantity of service/merchandise:
     - if service/merchandise has contract; insert initial contract and store insert id in contractId variable
       else; contractId = null
     - Insert initial purchase
10. return STRIPE payment intents to the front end to receive payment

### STRIPE Webhook order of op **\*\*\*\***\***\*\*\*\***

- after payment has been processed

* note: a stripe webhook is an 'event' that contains lots of info such as;

  - eventId
  - paymentIntentsId
  - paymentMethodId
  - chargeId
  - stripeCustomerId

1. Isolate objects/values from event as listed above and store them into variables
2. Get the Payment from our DB using the paymentIntentsId:

   - guard clauses;
     - if payment == undefined (does not exist in our db) return
     - if payment status==succeeded (payment has already been recorded) return
     - worried about edge cases here

3. Update payment in our DB (update eventId, and charge status)
4. Select all purchases under our payment_id
5. Loop through all purchases made under this payment:
   - if purchase has date_units_id & number_of_units;
     deactivationDate= calculated
     else:
     deactivationDate= null
   - Update purchase information (purchaseDate, and deactivationDate)
   - if there is a recurring payment contract id:
     - Update stripe customer in our DB (STRIPE payment method id)
     - get contract from our db
     - calculate contracts next payment date
     - IF contract start date exists (this is a recurring payment):
       - update contract (last payment date, next payment date, activate contract)
       - ELSE (this is the first successful payment): update contract (start date, last payment date, next payment date, activate contract)
   - insert into transaction table

### Automate services (cron job) **\*\*\*\***\*\*\*\***\*\*\*\***

- cron job does this every day

1. Gets all recurring payment contracts where:
   - next_payment_date <= todays date
   - is_active=1
   - recurring_payment_processing=0
2. Loop through all contract thats need payment:
   - Get/Verify stripe connect account using tenantId
   - Get stripeCustomerId and stripePaymentMethodId from our DB using user_id
   - Create STRIPE payment intents (return payment intents id):
     - note: although we are not done with our function, the stripe payment intents has already been sent out for processing
   - update contract (recurring_payment_processing), this is to avoid double charging if the cron job hits again and the payment is not yet complete:
     - this should really be done first, but if the create payment intents failed it would never attempt to charge them again
   - insert initial payment into our DB and retrieve the payment insertId
   - insert initial purchase insert
   - return
   * note: then the STRIPE webhook will hit and set the recurring_payment_processing=0
