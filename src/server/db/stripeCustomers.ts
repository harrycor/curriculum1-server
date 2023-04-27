import { Query } from "./index";

// SELECT
const getStripeCustomerByUserId = async (userId: number) => {
  return Query(
    `
    select * from stripe_customers
    where user_id=?
    `,
    [userId]
  );
};

// INSERT
const insertInitialNewStripeCustomer = async (
  userId: number,
  stripeCustomerId: string
) => {
  return Query(
    `
    insert into stripe_customers(
        user_id, 
        stripe_customer_id)
    values (?, ?);
    `,
    [userId, stripeCustomerId]
  );
};

// UPDATE
const updateCustomerStripePaymentMethodIdForRecurringPayments = async (
  stripePaymentMethodIdForRecurringPayments: string,
  userId: number
) => {
  return Query(
    `
  update stripe_customers
    set stripe_payment_method_id_for_recurring_payments=?
    where user_id = ?;
  `,
    [stripePaymentMethodIdForRecurringPayments, userId]
  );
};

export default {
  // SELECT
  getStripeCustomerByUserId,
  // INSERT
  insertInitialNewStripeCustomer,
  // UPDATE
  updateCustomerStripePaymentMethodIdForRecurringPayments,
};
