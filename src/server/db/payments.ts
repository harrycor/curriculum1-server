import { Query } from "./index";

//GET
const getPaymentByStripeEventIdAndStripePaymentIntentsId = (
  stripeEventId: string,
  stripePaymentIntentsId: string
) => {
  return Query(
    `
    select * from payments where stripe_event_id=? and stripe_payment_intents_id=?
    `,
    [stripeEventId, stripePaymentIntentsId]
  );
};

const selectPaymentByStripePaymentIntentsId = async (
  stripePaymentIntentsId: string
) => {
  return Query(
    `
  select * from payments
  where stripe_payment_intents_id=?;
  `,
    [stripePaymentIntentsId]
  );
};

const viewPaymentsForUser = async (userId: number) => {
  return Query(
    `
    select pu.*,pa.*,pi.first_name, pi.last_name from purchases pu
    join payments pa on pu.payments_id=pa.id
    join personal_info pi on pu.user_id=pi.user_id
    where pa.charge_status!="pending" and pu.user_id=?;
    `,
    [userId]
  );
};

const getPaymentsForUser = async (
  userId: number,
  dateFrom: Date,
  dateTo: Date
) => {
  //Harry, I am using purchase date, but there are many DB entries that only have date created. Which should I use?
  return Query(
    `
    select * from payments
    where charge_status!="pending" and charge_status!="failed" and purchase_date>? and purchase_date<? and user_id=?;
    `,
    [dateFrom, dateTo, userId]
  );
};

const getAllPaymentsForTenantWithinTimeFrame = async (
  tenantId: number,
  dateFrom: Date,
  dateTo: Date
) => {
  return Query(
    `
    select p.*, u.tenant, pi.first_name, pi.last_name from payments p
    left join users u on u.id=p.user_id
    left join personal_info pi on p.user_id=pi.user_id
    where u.tenant=? and p.purchase_date>? and p.purchase_date<?;
 `,
    [tenantId, dateFrom, dateTo]
  );
};

//POST
const insertNewPayment = async (
  userId: string,
  stripeEventId: string | null,
  stripePaymentIntentsId: string | null,
  connectAccountId: string,
  eventStatus: string,
  adminInsertByUserId: number,
  purchaseDate: Date | null
) => {
  return Query(
    `
  insert into payments(
      user_id,
      stripe_event_id,
      stripe_payment_intents_id,
      connect_account_id,
      charge_status,
      admin_insert_by_user_id,
      purchase_date)
    values(?,?,?,?,?,?,?);`,
    [
      userId,
      stripeEventId,
      stripePaymentIntentsId,
      connectAccountId,
      eventStatus,
      adminInsertByUserId,
      purchaseDate,
    ]
  );
};

const initialPaymentInsertWithInsertByAdminUserIdIfAny = async (
  userId: number,
  stripePaymentIntentsId: string,
  connectAccountId: string,
  adminInsertByUserId: number | null
) => {
  return Query(
    `
  insert into payments(
    user_id, 
    stripe_payment_intents_id, 
    connect_account_id, 
    charge_status,
    admin_insert_by_user_id)
  values(?,?,?,?,?);
  `,
    [
      userId,
      stripePaymentIntentsId,
      connectAccountId,
      "pending",
      adminInsertByUserId,
    ]
  );
};

const initialPaymentInsert = async (
  userId: number,
  stripePaymentIntentsId: string,
  connectAccountId: string
) => {
  return Query(
    `
  insert into payments(
    user_id, 
    stripe_payment_intents_id, 
    connect_account_id, 
    charge_status)
  values(?,?,?,?);
  `,
    [userId, stripePaymentIntentsId, connectAccountId, "pending"]
  );
};

// PUT
const updatePaymentWithInfoFromWebhook = async (
  paymentsId: number,
  stripeEventId: string,
  stripeChargeId: string,
  stripeChargeStatus: string,
  purchaseDate: Date
) => {
  return Query(
    `
  update payments
  set 
    stripe_event_id=?,
    stripe_charge_id=?,
    charge_status=?,
    purchase_date=?
  where id = ?;
  `,
    [
      stripeEventId,
      stripeChargeId,
      stripeChargeStatus,
      purchaseDate,
      paymentsId,
    ]
  );
};

export default {
  // GET
  getPaymentByStripeEventIdAndStripePaymentIntentsId,
  selectPaymentByStripePaymentIntentsId,
  viewPaymentsForUser,
  getPaymentsForUser,
  getAllPaymentsForTenantWithinTimeFrame,
  //POST
  insertNewPayment,
  initialPaymentInsertWithInsertByAdminUserIdIfAny,
  initialPaymentInsert,
  // PUT
  updatePaymentWithInfoFromWebhook,
};
