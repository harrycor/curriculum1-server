import { Query } from ".";

// SELECT
const selectRecurringPaymentContractById = async (
  recurringPaymentContractId: number
) => {
  return Query(
    `
    select rpc.*,
    du.unit
  from recurring_payment_contracts rpc
      join date_units du on rpc.date_units_id_for_expiration = du.id
  where rpc.id = ?;
  `,
    [recurringPaymentContractId]
  );
};

const selectAllContractsThatNeedPayment = async (todaysDate: Date) => {
  return Query(
    `
    select rpc.*,
    du.unit
  from recurring_payment_contracts rpc
      join date_units du on rpc.date_units_id_for_expiration = du.id
  where rpc.next_payment_date <= ? and rpc.is_active=1 and rpc.recurring_payment_processing=0;
  `,
    [todaysDate]
  );
};

const selectAllActiveRecurringPaymentContractsByUserId = async (
  userId: number
) => {
  return Query(
    `
  select rpc.*, du.unit, pi.first_name, pi.last_name
  from recurring_payment_contracts rpc
         join date_units du on rpc.date_units_id_for_expiration = du.id
         left join personal_info pi on rpc.user_id=pi.user_id
  where rpc.user_id = ?
  and rpc.is_active = 1 order by rpc.next_payment_date desc;
  `,
    [userId]
  );
};

const selectAllActiveRecurringPaymentContractsInTenant = async (
  tenantId: number
) => {
  return Query(
    `
  select rpc.*, du.unit, pi.first_name, pi.last_name
  from recurring_payment_contracts rpc
         join date_units du on rpc.date_units_id_for_expiration = du.id
         left join personal_info pi on rpc.user_id=pi.user_id
  where rpc.tenant_id = ?
  and rpc.is_active = 1 order by rpc.user_id, next_payment_date desc;
  `,
    [tenantId]
  );
};

// INSERT
const initialContractInsert = async (
  userId: number,
  tenantId: number,
  nameOfItem: string,
  itemTypeId: number,
  numberOfItemsIncluded: number,
  totalPriceOfServiceOrMerchandise: number,
  isAPrivateLesson: number,
  dateUnitsIdForExpiration: number | null,
  numberOfDateUnitsForExpiration: number | null,
  keepTrackOfAmountUsed: number,
  isAPractice: number,
  isUnlimited: number
) => {
  return Query(
    `
  insert into recurring_payment_contracts(
    user_id,
    tenant_id,
    name_of_item,
    item_type_id,
    number_of_items_included,
    total_price_of_service_or_merchandise,
    is_a_private_lesson,
    date_units_id_for_expiration,
    number_of_date_units_for_expiration,
    keep_track_of_amount_used,
    is_a_practice,
    is_unlimited)
value (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `,
    [
      userId,
      tenantId,
      nameOfItem,
      itemTypeId,
      numberOfItemsIncluded,
      totalPriceOfServiceOrMerchandise,
      isAPrivateLesson,
      dateUnitsIdForExpiration,
      numberOfDateUnitsForExpiration,
      keepTrackOfAmountUsed,
      isAPractice,
      isUnlimited,
    ]
  );
};

const initialContractInsertWithAdminUserIdInsert = async (
  userId: number,
  tenantId: number,
  nameOfItem: string,
  itemTypeId: number,
  numberOfItemsIncluded: number,
  totalPriceOfServiceOrMerchandise: number,
  isAPrivateLesson: number,
  dateUnitsIdForExpiration: number | null,
  numberOfDateUnitsForExpiration: number | null,
  keepTrackOfAmountUsed: number,
  isAPractice: number,
  isUnlimited: number,
  adminInsertUserId: number
) => {
  return Query(
    `
  insert into recurring_payment_contracts(
    user_id,
    tenant_id,
    name_of_item,
    item_type_id,
    number_of_items_included,
    total_price_of_service_or_merchandise,
    is_a_private_lesson,
    date_units_id_for_expiration,
    number_of_date_units_for_expiration,
    keep_track_of_amount_used,
    is_a_practice,
    is_unlimited,
    admin_insert_by_user_id)
value (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `,
    [
      userId,
      tenantId,
      nameOfItem,
      itemTypeId,
      numberOfItemsIncluded,
      totalPriceOfServiceOrMerchandise,
      isAPrivateLesson,
      dateUnitsIdForExpiration,
      numberOfDateUnitsForExpiration,
      keepTrackOfAmountUsed,
      isAPractice,
      isUnlimited,
      adminInsertUserId,
    ]
  );
};

// UPDATE
const updateRecurringPaymentContractAfterFirstSuccessfulPayment = async (
  recurringContractId: number,
  contractStartDate: Date,
  mostRecentPaymentDate: Date,
  nextPaymentDate: Date
) => {
  return Query(
    `
  update recurring_payment_contracts
set contract_start_date     = ?,
    most_recent_payment_date=?,
    next_payment_date=?,
    is_active=1
where id = ?;
  
  `,
    [
      contractStartDate,
      mostRecentPaymentDate,
      nextPaymentDate,
      recurringContractId,
    ]
  );
};

const updateRecurringPaymentContractAfterSuccessfulAutomaticPayment = async (
  recurringContractId: number,
  mostRecentPaymentDate: Date,
  nextPaymentDate: Date
) => {
  return Query(
    `
  update recurring_payment_contracts
  set most_recent_payment_date=?,
      next_payment_date=?,
      recurring_payment_processing=0,
      is_active=1
  where id = ?;
  `,
    [mostRecentPaymentDate, nextPaymentDate, recurringContractId]
  );
};

const updateRecurringPaymentContractRecurringPaymentProcessingStats = async (
  recurringPaymentContractId: number,
  recurringPaymentProcessingStatus: number
) => {
  return Query(
    `
  update recurring_payment_contracts
  set recurring_payment_processing=?
  where id = ?;
  `,
    [recurringPaymentProcessingStatus, recurringPaymentContractId]
  );
};

const updateRecurringPaymentContractToNotActive = async (
  recurringPaymentContractId: number
) => {
  return Query(
    `
  update recurring_payment_contracts
  set is_active=0
  where id = ?;
  `,
    [recurringPaymentContractId]
  );
};

export default {
  // SELECT
  selectRecurringPaymentContractById,
  selectAllContractsThatNeedPayment,
  selectAllActiveRecurringPaymentContractsByUserId,
  selectAllActiveRecurringPaymentContractsInTenant,
  // INSERT
  initialContractInsert,
  initialContractInsertWithAdminUserIdInsert,
  // UPDATE
  updateRecurringPaymentContractAfterFirstSuccessfulPayment,
  updateRecurringPaymentContractAfterSuccessfulAutomaticPayment,
  updateRecurringPaymentContractRecurringPaymentProcessingStats,
  updateRecurringPaymentContractToNotActive,
};
