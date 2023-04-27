import { Query } from "./index";

// GET
const getAllPurchasesLssonsRemainingAndValidPractices = async (
  userId: number
) => {
  return Query(
    `
    select p.id as purchases_id,
    p.tenant_id,
    p.name_of_item,
    p.item_type_id,
    p.number_of_items_included,
    p.purchase_date,
    p.amount_used,
    p.deactivation_date,
    it.item_type,
    t.tenant_name
  from purchases p
      join item_types it on p.item_type_id = it.id
      join tenants t on p.tenant_id = t.id
    where p.user_id = ?
    and ((p.amount_used >= 0 and p.amount_used < p.number_of_items_included)
    or (p.deactivation_date is not null and p.deactivation_date > p.purchase_date));
  `,
    [userId]
  );
};

const getAllPrivateLessonPurchasesForWrestler = async (userId: number) => {
  return Query(
    `
  select id,
       name_of_item,
       number_of_items_included,
       total_price_of_service_or_merchandise,
       purchase_date
  from purchases
  where user_id = ?
  and is_tracking_amount_used=1
  order by purchase_date desc, id desc;
  `,
    [userId]
  );
};

const getAllPurchasesByPaymentId = async (paymentsId: number) => {
  return Query(
    `
    select p.*,
       du.unit
    from purchases p
         left join date_units du on p.date_units_id_for_expiration = du.id
    where payments_id = ?;
  `,
    [paymentsId]
  );
};

const getAllPrivateLessonPurchasesForTenant = async (tenantId: number) => {
  return Query(
    `
  select total_price_of_service_or_merchandise
  from purchases
  where tenant_id = ?
  and (is_tracking_amount_used = 1 and deactivation_date is null);
  `,
    [tenantId]
  );
};

const getAllMerchPurchasesForTenant = async (tenantId: number) => {
  return Query(
    `
  select total_price_of_service_or_merchandise
  from purchases
  where tenant_id = ?
  and (is_tracking_amount_used = 0 and deactivation_date is null);
  `,
    [tenantId]
  );
};

// const getNumberOfItemsIncludedAndPriceOfSingleService = async (
//   userId: number
// ) => {
//   return Query(
//     `
//   select id, amount_used, number_of_items_included, total_price_of_service_or_merchandise
//     from purchases
//     where (user_id = ?)
//   and (amount_used is not null)
//   and (amount_used < number_of_items_included)
//     order by purchase_date
//     limit 1;
//   `,
//     [userId]
//   );
// };

// POST
const lessonsInfoFromArrayOfUserIds = async (values: any | number[]) => {
  return Query(
    `
  select 
    p.user_id,
    p.number_of_items_included,
    p.amount_used
  from purchases p
    where p.user_id in (?)
  and (p.amount_used >= 0 and (p.amount_used < p.number_of_items_included));
  `,
    [values]
  );
};

const lessonsPrchaseHistoryOfUserIdForLessonsUsedReference = async (
  userId: number
) => {
  return Query(
    `
  select 
  id as purchase_id,
  user_id,
  total_price_of_service_or_merchandise,
  number_of_items_included
from purchases
  where user_id = ?
and (is_tracking_amount_used = 1 and deactivation_date is null) order by purchase_date;
  `,
    [userId]
  );
};

const initialInsert = async (
  userId: number,
  tenantId: number,
  nameOfItem: string,
  itemTypeId: number,
  numberOfItemsIncluded: number,
  totalPriceOfServiceOrMerchandise: number,
  paymentsId: number,
  isAPrivateLesson: number,
  dateUnitsIdForExpiration: number | null,
  numberOfDateUnitsForExpiration: number | null,
  keepTrackOfAmountUsed: number,
  recurringPaymentContractsId: number | null,
  isAPractice: number | null,
  isUnlimited: number
) => {
  return Query(
    `
    insert into purchases(user_id,
      tenant_id,
      name_of_item,
      item_type_id,
      number_of_items_included,
      total_price_of_service_or_merchandise,
      payments_id,
      is_a_private_lesson,
      date_units_id_for_expiration,
      number_of_date_units_for_expiration,
      keep_track_of_amount_used,
      recurring_payment_contracts_id,
      is_a_practice,
      is_unlimited)
values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `,
    [
      userId,
      tenantId,
      nameOfItem,
      itemTypeId,
      numberOfItemsIncluded,
      totalPriceOfServiceOrMerchandise,
      paymentsId,
      isAPrivateLesson,
      dateUnitsIdForExpiration,
      numberOfDateUnitsForExpiration,
      keepTrackOfAmountUsed,
      recurringPaymentContractsId,
      isAPractice,
      isUnlimited,
    ]
  );
};

const purchaseInsertForAdminInsertCashPay = async (
  userId: number,
  tenantId: number,
  nameOfItem: string,
  itemTypeId: number,
  numberOfItemsIncluded: number,
  totalPriceOfServiceOrMerchandise: number,
  purchaseDate: Date,
  paymentsId: number,
  isAPrivateLesson: number,
  deactivationDate: Date | null,
  dateUnitsIdForExpiration: number | null,
  numberOfDateUnitsForExpiration: number | null,
  keepTrackOfAmountUsed: number,
  isAPractice: number,
  isUnlimited: number
) => {
  return Query(
    `
  insert into purchases(user_id, tenant_id, name_of_item, item_type_id, number_of_items_included,
    total_price_of_service_or_merchandise, purchase_date, payments_id, is_a_private_lesson,
    deactivation_date, date_units_id_for_expiration,
    number_of_date_units_for_expiration, keep_track_of_amount_used,
    is_a_practice, is_unlimited)
values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `,
    [
      userId,
      tenantId,
      nameOfItem,
      itemTypeId,
      numberOfItemsIncluded,
      totalPriceOfServiceOrMerchandise,
      purchaseDate,
      paymentsId,
      isAPrivateLesson,
      deactivationDate,
      dateUnitsIdForExpiration,
      numberOfDateUnitsForExpiration,
      keepTrackOfAmountUsed,
      isAPractice,
      isUnlimited,
    ]
  );
};

const initialBatchInsert = async (values: any) => {
  return Query(
    `
    insert into purchases(
      user_id,
      tenant_id,
      name_of_item,
      item_type_id,
      number_of_items_included,
      total_price_of_service_or_merchandise,
      payments_id,
      is_a_private_lesson,
      date_units_id_for_expiration,
      number_of_date_units_for_expiration,
      keep_track_of_amount_used)
  values ?;
  `,
    [values]
  );
};

// PUT
const batchInsertPurchases = async (values: any) => {
  return Query(
    `
insert into purchases (
  user_id,
  tenant_id,
  name_of_item,
  item_type_id,
  number_of_items_included,
  total_price_of_service_or_merchandise,
  purchase_date,
  payments_id,
  is_tracking_amount_used,
  deactivation_date)
   values ?
`,
    [values]
  );
};

const setAmountUsedForCheckIn = async (
  newAmountUsed: number,
  purchasesId: number
) => {
  return Query(
    `
  update purchases
    set amount_used=?
    where id=?;
  `,
    [newAmountUsed, purchasesId]
  );
};

const updatePurchaseAfterSuccessfulPayment = async (
  purchaseId: number,
  purchaseDate: Date,
  deactivationDate: Date | null
) => {
  return Query(
    `
  update purchases
    set purchase_date=?,
    deactivation_date=?
  where id = ?;
  `,
    [purchaseDate, deactivationDate, purchaseId]
  );
};

export default {
  // GET
  getAllPurchasesLssonsRemainingAndValidPractices,
  getAllPrivateLessonPurchasesForWrestler,
  getAllPurchasesByPaymentId,
  getAllPrivateLessonPurchasesForTenant,
  getAllMerchPurchasesForTenant,
  // getNumberOfItemsIncludedAndPriceOfSingleService,
  lessonsPrchaseHistoryOfUserIdForLessonsUsedReference,
  // POST
  lessonsInfoFromArrayOfUserIds,
  initialInsert,
  purchaseInsertForAdminInsertCashPay,
  // initialBatchInsert,
  // PUT
  batchInsertPurchases,
  setAmountUsedForCheckIn,
  updatePurchaseAfterSuccessfulPayment,
};
