import { Query } from ".";

// SELECT
const getTransactionsForPurchase = async (purchaseId: number) => {
  return Query(
    `
  select * from transactions where purchases_id=?
  `,
    [purchaseId]
  );
};

const getAmountOfRemainingPrivateLessonsForAllUsersInArray = async (
  values: any
) => {
  return Query(
    `
  select user_id, SUM(credit - debit) as number_of_private_lessons_remaining
  from transactions
  where is_a_private_lesson = 1
  and user_id in (?)
  group by user_id;
  `,
    [values]
  );
};

const getAmountOfRemainingPrivateLessonsForUser = async (userId: number) => {
  return Query(
    `
  select SUM(credit - debit) as number_of_private_lessons_remaining
  from transactions
  where is_a_private_lesson = 1
  and user_id =?;
  `,
    [userId]
  );
};

const selectAllTransactionsInArrayOfPrivateLessonsBookingsIds = async (
  values: any
) => {
  return Query(
    `
  select *
  from transactions
  where private_lesson_bookings_id in (?);
  `,
    [values]
  );
};

const selectAllTransactionsWithAvailablePrivateLessonCredits = async (
  userId: number
) => {
  return Query(
    `
    select t1.*,
    (select SUM(credit - debit)
     from transactions t2
     where t1.purchases_id = t2.purchases_id
       and t1.user_id = ?
       and t1.is_a_private_lesson = 1
     group by purchases_id
     having SUM(t2.credit - t2.debit) > 0) as number_of_lessons_remaining,
    p.total_price_of_service_or_merchandise,
    p.number_of_items_included
from transactions t1
      join purchases p on t1.purchases_id = p.id
where t1.user_id = ?
and t1.is_a_private_lesson = 1
and private_lesson_bookings_id is null
and (select SUM(credit - debit)
    from transactions t2
    where t1.purchases_id = t2.purchases_id
      and t1.user_id = ?
      and t1.is_a_private_lesson = 1
    group by purchases_id
    having SUM(t2.credit - t2.debit) > 0) > 0
order by t1.date_created;
  `,
    [userId, userId, userId]
  );
};

const selectAllTransactionsOfPrivateLessonsPurchased = async (
  userId: number,
  dateFrom: Date,
  dateTo: Date
) => {
  return Query(
    `
    select t1.*,
    (select SUM(credit - debit)
     from transactions t2
     where t1.purchases_id = t2.purchases_id
       and t1.user_id = ?
       and t1.is_a_private_lesson = 1
     group by purchases_id
     having SUM(t2.credit - t2.debit) > -1) as number_of_lessons_remaining,
     p.name_of_item,
     p.number_of_items_included,
     p.purchase_date,
    p.total_price_of_service_or_merchandise,
    p.number_of_items_included
from transactions t1
      join purchases p on t1.purchases_id = p.id
where t1.user_id = ?
and t1.is_a_private_lesson = 1
and private_lesson_bookings_id is null
and (p.purchase_date >= ? and p.purchase_date <= ?)
and (select SUM(credit - debit)
    from transactions t2
    where t1.purchases_id = t2.purchases_id
      and t1.user_id = ?
      and t1.is_a_private_lesson = 1
    group by purchases_id
    having SUM(t2.credit - t2.debit) > -1) > -1
order by p.purchase_date;
  `,
    [userId, userId, dateFrom, dateTo, userId]
  );
};

const selectSinglePrivateLessonCheckInForWrestler = async (
  privateLessonBookingsId: number
) => {
  return Query(
    `select *
    from transactions
    where private_lesson_bookings_id = ?;`,
    [privateLessonBookingsId]
  );
};

const selectLifetimeEarningsOfPrivateLessonsForCoach = async (
  coachesUserId: number
) => {
  return Query(
    `
  select round(SUM(pp.payout_percentage_of_private_lessons / 100 * t.price_paid_for_lesson),
             2) as lifetime_amount_made_by_coach_for_private_lessons
  from transactions t
         join payout_percentages pp on t.payout_percentage_id = pp.id
  where t.coach_user_id = ?
    and t.is_a_private_lesson = 1
  group by t.coach_user_id;
  `,
    [coachesUserId]
  );
};

const selectLifetimeEarningsOfPrivateLessonsForCoachDateRange = async (
  coachesUserId: number,
  dateFrom: Date,
  dateTo: Date
) => {
  return Query(
    `
    select round(SUM(pp.payout_percentage_of_private_lessons / 100 * t.price_paid_for_lesson),
    2) as date_range_amount_made_by_coach_for_private_lessons
from transactions t
join payout_percentages pp on t.payout_percentage_id = pp.id
where t.coach_user_id = ?
and t.is_a_private_lesson = 1
and (t.date_of_lesson >= ? and t.date_of_lesson <= ?)
group by t.coach_user_id;
  `,
    [coachesUserId, dateFrom, dateTo]
  );
};

const selectAllTransactionInDateRangeSelectForCoachId = async (
  coachId: number,
  dateFrom: Date,
  dateTo: Date
) => {
  return Query(
    `
  select t.id           as transaction_id,
       t.price_paid_for_lesson,
       t.check_in_date_and_time,
       u1.email       as coach_email,
       pi1.first_name as coach_first_name,
       pi1.last_name  as coach_last_name,
       u2.email       as wrestler_email,
       pi2.first_name as wrestler_first_name,
       pi2.last_name  as wrestler_last_name,
       u3.email       as checked_in_by_email,
       pi3.first_name as checked_in_by_first_name,
       pi3.last_name  as checked_in_by_last_name,
       plb.date_of_lesson,
       plb.start_time as lesson_start_time,
       plb.duration,
       pp.payout_percentage_of_private_lessons
from transactions t
         join users u1 on t.coach_user_id = u1.id
         join users u2 on t.wrestler_user_id = u2.id
         join users u3 on t.checked_in_by_user_id = u3.id
         left join personal_info pi1 on t.coach_user_id = pi1.user_id
         left join personal_info pi2 on t.wrestler_user_id = pi2.user_id
         left join personal_info pi3 on t.checked_in_by_user_id = pi3.user_id
         join private_lesson_bookings plb on t.private_lesson_bookings_id = plb.id
         left join payout_percentages pp on t.payout_percentage_id = pp.id
where t.coach_user_id = ?
  and t.is_a_private_lesson = 1
  and (DATE(t.date_of_lesson) >= DATE(?) and DATE(t.date_of_lesson) <= DATE(?))
order by t.date_of_lesson;
  `,
    [coachId, dateFrom, dateTo]
  );
};

const selectAllUsedPrivateLessonsFromTransactionsWithInDateRangeForWrestlerId =
  async (wrestlerId: number, dateFrom: Date, dateTo: Date) => {
    return Query(
      `
  select t.id           as lessons_used_id,
       t.price_paid_for_lesson,
       t.check_in_date_and_time,
       u1.email       as coach_email,
       pi1.first_name as coach_first_name,
       pi1.last_name  as coach_last_name,
       u2.email       as wrestler_email,
       pi2.first_name as wrestler_first_name,
       pi2.last_name  as wrestler_last_name,
       u3.email       as checked_in_by_email,
       pi3.first_name as checked_in_by_first_name,
       pi3.last_name  as checked_in_by_last_name,
       plb.date_of_lesson,
       plb.start_time as lesson_start_time,
       plb.duration
from transactions t
         join users u1 on t.coach_user_id = u1.id
         join users u2 on t.wrestler_user_id = u2.id
         join users u3 on t.checked_in_by_user_id = u3.id
         left join personal_info pi1 on t.coach_user_id = pi1.user_id
         left join personal_info pi2 on t.wrestler_user_id = pi2.user_id
         left join personal_info pi3 on t.checked_in_by_user_id = pi3.user_id
         join private_lesson_bookings plb on t.private_lesson_bookings_id = plb.id
where t.wrestler_user_id = ?
  and (DATE(t.date_of_lesson) >= DATE(?) and DATE(t.date_of_lesson) <= DATE(?))
  and t.is_a_private_lesson = 1
order by t.date_of_lesson;
  `,
      [wrestlerId, dateFrom, dateTo]
    );
  };

const selectAllUsedPracticesFromTransactionsInDateRangeForWrestlerId = async (
  wrestlerId: number,
  dateFrom: Date,
  dateTo: Date
) => {
  return Query(
    `
  select t.id           as practice_used_id,
  t.check_in_date_and_time,
  u2.email       as wrestler_email,
  pi2.first_name as wrestler_first_name,
  pi2.last_name  as wrestler_last_name,
  u3.email       as checked_in_by_email,
  pi3.first_name as checked_in_by_first_name,
  pi3.last_name  as checked_in_by_last_name
from transactions t
    join users u2 on t.user_id = u2.id
    join users u3 on t.checked_in_by_user_id = u3.id
    left join personal_info pi2 on t.user_id = pi2.user_id
    left join personal_info pi3 on t.checked_in_by_user_id = pi3.user_id
where t.user_id = ?
and (t.check_in_date_and_time >= ? and t.check_in_date_and_time <= ?)
and t.is_a_practice = 1
order by t.check_in_date_and_time;
  `,
    [wrestlerId, dateFrom, dateTo]
  );
};

const selectAllTransactionsDateOfUseForPrivateLessonsByPurchaseId = async (
  userId: number
) => {
  return Query(
    `
  select purchases_id, date_of_lesson, time_of_lesson
from transactions
where is_a_private_lesson = 1
  and private_lesson_bookings_id is not null
  and user_id = ?
order by check_in_date_and_time;
  `,
    [userId]
  );
};

const getAllAvailablePracticesNOTUnlimited = async (
  todaysDate: Date,
  userId: number
) => {
  return Query(
    `
  select t1.*,
       (select SUM(credit - debit)
        from transactions t2
        where t1.purchases_id = t2.purchases_id
          and t1.user_id = ?
          and t1.is_a_practice = 1
          and t1.is_unlimited = 0
          and (DATE(t1.deactivation_date) >= DATE(?) or t1.deactivation_date is null)
          and t1.private_lesson_bookings_id is null
        group by purchases_id
        having SUM(t2.credit - t2.debit) > 0) as number_of_practices_remaining,
       p.total_price_of_service_or_merchandise,
       p.number_of_items_included
from transactions t1
         join purchases p on t1.purchases_id = p.id
where t1.user_id = ?
  and t1.is_a_practice = 1
  and t1.is_unlimited = 0
  and (DATE(t1.deactivation_date) >= DATE(?) or t1.deactivation_date is null)
  and t1.private_lesson_bookings_id is null
  and (select SUM(credit - debit)
       from transactions t2
       where t1.purchases_id = t2.purchases_id
         and t1.user_id = ?
         and t1.is_a_practice = 1
         and t1.is_unlimited = 0
         and (DATE(t1.deactivation_date) >= DATE(?) or t1.deactivation_date is null)
         and t1.private_lesson_bookings_id is null
       group by purchases_id
       having SUM(t2.credit - t2.debit) > 0) > 0
order by t1.date_created;
  `,
    [userId, todaysDate, userId, todaysDate, userId, todaysDate]
  );
};

const selectAllNotUnlimitedPracticePurchasesMadeByUserFromTransactions = async (
  userId: number,
  dateFrom: Date,
  dateTo: Date
) => {
  return Query(
    `
    select t1.*,
    (select SUM(credit - debit)
     from transactions t2
     where t1.purchases_id = t2.purchases_id
       and t1.user_id = ?
       and t1.is_a_practice = 1
       and t1.is_unlimited = 0
     group by purchases_id
     having SUM(t2.credit - t2.debit) > -1) as number_of_practices_remaining,
    p.name_of_item,
    p.number_of_items_included,
    p.purchase_date,
    p.total_price_of_service_or_merchandise,
    p.number_of_items_included
from transactions t1
      join purchases p on t1.purchases_id = p.id
where t1.user_id = ?
and t1.is_a_practice = 1
and t1.is_unlimited = 0
and checked_in_by_user_id is null
and (p.purchase_date >= ? and p.purchase_date <= ?)
and (select SUM(credit - debit)
    from transactions t2
    where t1.purchases_id = t2.purchases_id
      and t1.user_id = ?
      and t1.is_unlimited = 0
      and t1.is_a_practice = 1
    group by purchases_id
    having SUM(t2.credit - t2.debit) > -1) > -1
order by p.purchase_date;
  `,
    [userId, userId, dateFrom, dateTo, userId]
  );
};

const selectAllAvailableUnlimitedPracticesForUserId = async (
  todaysDate: Date,
  userId: number
) => {
  return Query(
    `
select *
from transactions
where user_id = ?
and( DATE(deactivation_date) >= Date(?) or deactivation_date is null)
  and is_a_practice = 1
  and is_unlimited = 1
  and debit = 0
  and credit > 0
order by date_created;
`,
    [userId, todaysDate]
  );
};

const getAllPracticeCheckInsWithInDateRange = async (
  tenantId: number,
  dateFrom: Date,
  dateTo: Date
) => {
  return Query(
    `
  select t.*,
       pi1.first_name as wrestler_first_name,
       pi1.last_name  as wrestler_last_name,
       u1.email       as wrestlers_email,
       pi3.first_name as checked_in_by_first_name,
       pi3.last_name  as checked_in_by_last_name,
       u3.email       as checked_in_by_email
from transactions t
         join users u1 on t.user_id = u1.id
         join users u3 on t.checked_in_by_user_id = u3.id
         left join personal_info pi1 on t.user_id = pi1.user_id
         left join personal_info pi2 on t.coach_user_id = pi2.user_id
         left join personal_info pi3 on t.checked_in_by_user_id = pi3.user_id
where t.tenant_id = ?
  and t.is_a_practice = 1
  and t.credit = 0
  and (t.check_in_date_and_time >= ? and t.check_in_date_and_time <= ?)
  order by t.check_in_date_and_time;
  `,
    [tenantId, dateFrom, dateTo]
  );
};

const selectAllUnlimitedPracticePurchasesWithinDateRangeForWrestler = async (
  userId: number,
  dateFrom: Date,
  dateTo: Date
) => {
  return Query(
    `
  select t.*,
       p.name_of_item,
       p.purchase_date,
       p.total_price_of_service_or_merchandise,
       p.number_of_items_included
from transactions t
         join purchases p on t.purchases_id = p.id
where t.user_id = ?
  and t.is_a_practice = 1
  and t.is_unlimited = 1
  and t.credit > 0
  and t.debit = 0
  and t.checked_in_by_user_id is null
  and (p.purchase_date >= ? and p.purchase_date <= ?)
order by p.purchase_date;
  `,
    [userId, dateFrom, dateTo]
  );
};

const selectAllPracticeCheckInsForUserId = async (
  userId: number,
  values: any
) => {
  return Query(
    `
  
  select purchases_id, check_in_date_and_time
from transactions
where is_a_practice = 1
  and checked_in_by_user_id is not null
  and user_id = ?
  and purchases_id in (?)
order by check_in_date_and_time;`,
    [userId, values]
  );
};

const confirmIfWrestlerHasCheckedInForPracticeTodayAlready = (
  userId: number,
  startOfDay: Date,
  endOfDay: Date
) => {
  return Query(
    `
  select *
from transactions
where is_a_practice
  and credit = 0
  and debit = 1
  and (check_in_date_and_time >= ? and check_in_date_and_time <= ?)
  and user_id = ?;
  `,
    [startOfDay, endOfDay, userId]
  );
};

const getAllPaymentTransactionsWithDetailsFOrUserId = (
  wrestlerId: number,
  dateFrom: Date,
  dateTo: Date
) => {
  return Query(
    `
  select t1.*,
       (select SUM(credit - debit)
        from transactions t2
        where t1.purchases_id = t2.purchases_id
          and t1.user_id = ?
        group by purchases_id
        having SUM(t2.credit - t2.debit) > -1) as number_of_items_remaining,
        pi.first_name                           as purchase_made_by_first_name,
        pi.last_name                            as purchase_made_by_first_name,
       p.name_of_item,
       p.number_of_items_included,
       p.purchase_date,
       p.total_price_of_service_or_merchandise,
       p.number_of_items_included,
       pa.charge_status,
       rpc.id as recurring_payment_contract_id,
       rpc.contract_start_date,
       rpc.most_recent_payment_date,
       rpc.next_payment_date,
       rpc.is_active                           as recurring_payment_contract_active_status
from transactions t1
         join purchases p on t1.purchases_id = p.id
         join payments pa on t1.payments_id = pa.id
         left join recurring_payment_contracts rpc on p.recurring_payment_contracts_id = rpc.id
         left join personal_info pi on t1.user_id = pi.user_id
where t1.user_id = ?
  and t1.debit = 0
  and private_lesson_bookings_id is null
  and (p.purchase_date >= ? and p.purchase_date <= ?)
  and (select SUM(credit - debit)
       from transactions t2
       where t1.purchases_id = t2.purchases_id
         and t1.user_id = ?
       group by purchases_id
       having SUM(t2.credit - t2.debit) > -1) > -1
order by p.purchase_date;

  `,
    [wrestlerId, wrestlerId, dateFrom, dateTo, wrestlerId]
  );
};

const getAllPaymentTransactionsWithDetailsForTenantWithInTimeFrame = (
  tenantId: number,
  dateFrom: Date,
  dateTo: Date
) => {
  return Query(
    `
  select t1.*,
       (select SUM(credit - debit)
        from transactions t2
        where t1.purchases_id = t2.purchases_id
          and t1.tenant_id = ?
        group by purchases_id
        having SUM(t2.credit - t2.debit) > -1) as number_of_items_remaining,
        pi.first_name                           as purchase_made_by_first_name,
        pi.last_name                            as purchase_made_by_last_name,
       p.name_of_item,
       p.number_of_items_included,
       p.purchase_date,
       p.total_price_of_service_or_merchandise,
       p.number_of_items_included,
       pa.charge_status,
       rpc.id                                  as recurring_payment_contract_id,
       rpc.contract_start_date,
       rpc.most_recent_payment_date,
       rpc.next_payment_date,
       rpc.is_active                           as recurring_payment_contract_active_status
from transactions t1
         join purchases p on t1.purchases_id = p.id
         join payments pa on t1.payments_id = pa.id
         left join recurring_payment_contracts rpc on p.recurring_payment_contracts_id = rpc.id
         left join personal_info pi on t1.user_id = pi.user_id
where t1.tenant_id = ?
  and t1.debit = 0
  and private_lesson_bookings_id is null
  and (p.purchase_date >= ? and p.purchase_date <= ?)
  and (select SUM(credit - debit)
       from transactions t2
       where t1.purchases_id = t2.purchases_id
         and t1.tenant_id = ?
       group by purchases_id
       having SUM(t2.credit - t2.debit) > -1) > -1
order by p.purchase_date;
  `,
    [tenantId, tenantId, dateFrom, dateTo, tenantId]
  );
};

const checkInWrestlerForPractice = async (
  userId: number,
  tenantId: number,
  paymentsId: number,
  purchasesId: number,
  itemTypeId: number,
  isAPrivateLesson: number,
  keepTrackOfAmountUsed: number,
  deactivationDate: Date,
  checkedInByUserId: number,
  checkInDateAndTime: Date,
  isAPractice: number,
  isUnlimited: number
) => {
  return Query(
    `
  insert into transactions(
    user_id,
    tenant_id,
    payments_id,
    purchases_id,
    item_type_id,
    is_a_private_lesson,
    keep_track_of_amount_used,
    deactivation_date,
    checked_in_by_user_id,
    check_in_date_and_time,
    debit,
    is_a_practice,
    is_unlimited)
values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `,
    [
      userId,
      tenantId,
      paymentsId,
      purchasesId,
      itemTypeId,
      isAPrivateLesson,
      keepTrackOfAmountUsed,
      deactivationDate,
      checkedInByUserId,
      checkInDateAndTime,
      1,
      isAPractice,
      isUnlimited,
    ]
  );
};

// INSERT
const initialInsertAfterSuccessfulPayment = async (
  userId: number,
  tenantId: number,
  paymentsId: number,
  purchasesId: number,
  itemTypeId: number,
  isAPrivateLesson: number,
  keepTrackOfAmountUsed: number,
  deactivationDate: Date | null,
  credit: number,
  isAPractice: number | null,
  isUnlimited: number,
  adminInsertUserId: number | null
) => {
  return Query(
    `
    insert into transactions(
        user_id,
        tenant_id,
        payments_id,
        purchases_id,
        item_type_id,
        is_a_private_lesson,
        keep_track_of_amount_used,
        deactivation_date,
        credit,
        is_a_practice,
        is_unlimited,
        admin_insert_by_user_id)
    value (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      userId,
      tenantId,
      paymentsId,
      purchasesId,
      itemTypeId,
      isAPrivateLesson,
      keepTrackOfAmountUsed,
      deactivationDate,
      credit,
      isAPractice,
      isUnlimited,
      adminInsertUserId,
    ]
  );
};

const initialInsertAdminInsert = async (
  userId: number,
  tenantId: number,
  paymentsId: number,
  purchasesId: number,
  itemTypeId: number,
  isAPrivateLesson: number,
  keepTrackOfAmountUsed: number,
  deactivationDate: Date | null,
  credit: number,
  isAPractice: number | null,
  isUnlimited: number,
  adminInsertByUserId: number
) => {
  return Query(
    `
    insert into transactions(
        user_id,
        tenant_id,
        payments_id,
        purchases_id,
        item_type_id,
        is_a_private_lesson,
        keep_track_of_amount_used,
        deactivation_date,
        credit,
        is_a_practice,
        is_unlimited,
        admin_insert_by_user_id)
    value (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      userId,
      tenantId,
      paymentsId,
      purchasesId,
      itemTypeId,
      isAPrivateLesson,
      keepTrackOfAmountUsed,
      deactivationDate,
      credit,
      isAPractice,
      isUnlimited,
      adminInsertByUserId,
    ]
  );
};

// UPDATE
const checkInWrestlerForPrivateLesson = async (
  userId: number,
  tenantId: number,
  paymentsId: number,
  purchasesId: number,
  itemTypeId: number,
  isAPrivateLessons: number,
  deactivationDate: Date,
  keepTrackOfAmountUsed: number,
  wrestlerUserId: number,
  coachUserId: number,
  checkedInByUserId: number,
  payoutPercentageId: number,
  privateLessonsBookingsId: number,
  pricePaidForLesson: number,
  dateOfLesson: Date,
  timeOfLesson: any,
  checkInDateAndTime: Date
) => {
  return Query(
    `
insert into transactions(
  user_id,
  tenant_id,
  payments_id,
  purchases_id,
  item_type_id,
  is_a_private_lesson,
  deactivation_date,
  keep_track_of_amount_used,
  wrestler_user_id,
  coach_user_id,
  checked_in_by_user_id,
  payout_percentage_id,
  private_lesson_bookings_id,
  price_paid_for_lesson,
  date_of_lesson,
  time_of_lesson,
  check_in_date_and_time,
  debit)
values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `,
    [
      userId,
      tenantId,
      paymentsId,
      purchasesId,
      itemTypeId,
      isAPrivateLessons,
      deactivationDate,
      keepTrackOfAmountUsed,
      wrestlerUserId,
      coachUserId,
      checkedInByUserId,
      payoutPercentageId,
      privateLessonsBookingsId,
      pricePaidForLesson,
      dateOfLesson,
      timeOfLesson,
      checkInDateAndTime,
      1,
    ]
  );
};

// DELETE
const removePrivateLessonCheckInForWrestler = async (
  privateLessonBookingsId: number
) => {
  return Query(
    `delete
    from transactions
    where private_lesson_bookings_id = ?;`,
    [privateLessonBookingsId]
  );
};

const removeTransactionByTransactionId = async (transactionId: number) => {
  return Query(
    `
  delete from transactions where id = ?
  `,
    [transactionId]
  );
};

export default {
  // SELECT
  getTransactionsForPurchase,
  getAmountOfRemainingPrivateLessonsForAllUsersInArray,
  getAmountOfRemainingPrivateLessonsForUser,
  selectAllTransactionsInArrayOfPrivateLessonsBookingsIds,
  selectAllTransactionsWithAvailablePrivateLessonCredits,
  selectAllTransactionsOfPrivateLessonsPurchased,
  selectSinglePrivateLessonCheckInForWrestler,
  selectLifetimeEarningsOfPrivateLessonsForCoach,
  selectLifetimeEarningsOfPrivateLessonsForCoachDateRange,
  selectAllTransactionInDateRangeSelectForCoachId,
  selectAllTransactionsDateOfUseForPrivateLessonsByPurchaseId,
  selectAllUsedPrivateLessonsFromTransactionsWithInDateRangeForWrestlerId,
  selectAllNotUnlimitedPracticePurchasesMadeByUserFromTransactions,
  selectAllAvailableUnlimitedPracticesForUserId,
  checkInWrestlerForPractice,
  getAllAvailablePracticesNOTUnlimited,
  getAllPracticeCheckInsWithInDateRange,
  selectAllUnlimitedPracticePurchasesWithinDateRangeForWrestler,
  selectAllPracticeCheckInsForUserId,
  selectAllUsedPracticesFromTransactionsInDateRangeForWrestlerId,
  confirmIfWrestlerHasCheckedInForPracticeTodayAlready,
  getAllPaymentTransactionsWithDetailsForTenantWithInTimeFrame,

  // INSERT
  initialInsertAfterSuccessfulPayment,
  initialInsertAdminInsert,
  // UPDATE
  checkInWrestlerForPrivateLesson,
  // DELETE
  removePrivateLessonCheckInForWrestler,
  removeTransactionByTransactionId,

  getAllPaymentTransactionsWithDetailsFOrUserId,
};
