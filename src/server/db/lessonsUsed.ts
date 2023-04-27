import { Query } from ".";

// GET
const getPricePaidForLessonsAndCoachsPayoutPercentageForAllLessonsUsed = async (
  coachsUserId: number
) => {
  return Query(
    `
    select lu.price_paid_for_lesson,
    pp.payout_percentage_of_private_lessons
    from lessons_used lu
    join payout_percentages pp on lu.payout_percentage_id = pp.id
    where lu.coachs_user_id=?;
    `,
    [coachsUserId]
  );
};

const getAllCheckInsMadeByCoachId = async (coachId: number) => {
  return Query(
    `
  select lu.price_paid_for_lesson,
       lu.date_and_time_of_lesson,
       u.email,
       pi.first_name,
       pi.last_name,
       pp.payout_percentage_of_private_lessons
    from lessons_used lu
         join dynamic_curriculum.users u on lu.user_id = u.id
         left join personal_info pi on u.id = pi.user_id
         left join payout_percentages pp on lu.payout_percentage_id = pp.id
    where lu.coachs_user_id = ?;
  `,
    [coachId]
  );
};

const getAmountOfLessonsUsed = async (wrestlerUserId: number) => {
  return Query(
    `
  select count(*) as amount_of_lessons_used
  from lessons_used
  where wrestler_user_id = ?;
  `,
    [wrestlerUserId]
  );
};

const getAlllessonsUsedByArrayOfPrivateLessonBookingsIds = async (
  values: any
) => {
  return Query(
    `
  select 
  private_lesson_bookings_id,
  check_in_date_and_time
  from lessons_used
  where private_lesson_bookings_id in (?)
  `,
    [values]
  );
};

const getLessonUsedInfoByPrivateLessonBookingsId = async (
  privateLessonBookingsId: number
) => {
  return Query(
    `
  select *
  from lessons_used
  where private_lesson_bookings_id=?;
  `,
    [privateLessonBookingsId]
  );
};

const getAllLessonsUsedForWrestlerId = async (wrestlerId: number) => {
  return Query(
    `
    select lu.id           as lessons_used_id,
       lu.price_paid_for_lesson,
       lu.check_in_date_and_time,
       u1.email        as coach_email,
       pi1.first_name  as coach_first_name,
       pi1.last_name   as coach_last_name,
       u2.email        as wrestler_email,
       pi2.first_name  as wrestler_first_name,
       pi2.last_name   as wrestler_last_name,
       u3.email        as checked_in_by_email,
       pi3.first_name  as checked_in_by_first_name,
       pi3.last_name   as checked_in_by_last_name,
       plb.date_of_lesson,
       plb.start_time  as lesson_start_time,
       plb.duration
    from lessons_used lu
         join users u1 on lu.coach_user_id = u1.id
         join users u2 on lu.wrestler_user_id = u2.id
         join users u3 on lu.checked_in_by_user_id = u3.id
         left join personal_info pi1 on lu.coach_user_id = pi1.user_id
         left join personal_info pi2 on lu.wrestler_user_id = pi2.user_id
         left join personal_info pi3 on lu.checked_in_by_user_id = pi3.user_id
         join private_lesson_bookings plb on lu.private_lesson_bookings_id = plb.id
    where lu.wrestler_user_id = ?;
  `,
    [wrestlerId]
  );
};

const getAllLessonsUsedPurchaseIdsForWreslterId = async (
  wreslterId: number
) => {
  return Query(
    `
  select purchase_id
  from lessons_used
  where wrestler_user_id = ?;
  `,
    [wreslterId]
  );
};

const getAllLessonsUsedInMonthSelectedForWrestlerId = async (
  wrestlerId: number,
  dateFrom: string,
  dateTo: string
) => {
  return Query(
    `
    select lu.id           as lessons_used_id,
       lu.price_paid_for_lesson,
       lu.check_in_date_and_time,
       u1.email        as coach_email,
       pi1.first_name  as coach_first_name,
       pi1.last_name   as coach_last_name,
       u2.email        as wrestler_email,
       pi2.first_name  as wrestler_first_name,
       pi2.last_name   as wrestler_last_name,
       u3.email        as checked_in_by_email,
       pi3.first_name  as checked_in_by_first_name,
       pi3.last_name   as checked_in_by_last_name,
       plb.date_of_lesson,
       plb.start_time  as lesson_start_time,
       plb.duration
    from lessons_used lu
         join users u1 on lu.coach_user_id = u1.id
         join users u2 on lu.wrestler_user_id = u2.id
         join users u3 on lu.checked_in_by_user_id = u3.id
         left join personal_info pi1 on lu.coach_user_id = pi1.user_id
         left join personal_info pi2 on lu.wrestler_user_id = pi2.user_id
         left join personal_info pi3 on lu.checked_in_by_user_id = pi3.user_id
         join private_lesson_bookings plb on lu.private_lesson_bookings_id = plb.id
    where lu.wrestler_user_id = ?
    and (lu.date_of_lesson >= ? and lu.date_of_lesson <= ?)
    order by lu.date_of_lesson;
  `,
    [wrestlerId, dateFrom, dateTo]
  );
};

const getAllLessonsUsedInDateRangeSelectedForCoachId = async (
  coachId: number,
  dateFrom: string,
  dateTo: string
) => {
  return Query(
    `
    select lu.id           as lessons_used_id,
       lu.price_paid_for_lesson,
       lu.check_in_date_and_time,
       u1.email        as coach_email,
       pi1.first_name  as coach_first_name,
       pi1.last_name   as coach_last_name,
       u2.email        as wrestler_email,
       pi2.first_name  as wrestler_first_name,
       pi2.last_name   as wrestler_last_name,
       u3.email        as checked_in_by_email,
       pi3.first_name  as checked_in_by_first_name,
       pi3.last_name   as checked_in_by_last_name,
       plb.date_of_lesson,
       plb.start_time  as lesson_start_time,
       plb.duration,
       pp.payout_percentage_of_private_lessons
    from lessons_used lu
         join users u1 on lu.coach_user_id = u1.id
         join users u2 on lu.wrestler_user_id = u2.id
         join users u3 on lu.checked_in_by_user_id = u3.id
         left join personal_info pi1 on lu.coach_user_id = pi1.user_id
         left join personal_info pi2 on lu.wrestler_user_id = pi2.user_id
         left join personal_info pi3 on lu.checked_in_by_user_id = pi3.user_id
         join private_lesson_bookings plb on lu.private_lesson_bookings_id = plb.id
         left join payout_percentages pp on lu.payout_percentage_id = pp.id
    where lu.coach_user_id = ?
    and (lu.date_of_lesson >= ? and lu.date_of_lesson <= ?)
    order by lu.date_of_lesson;
  `,
    [coachId, dateFrom, dateTo]
  );
};

const getAllLessonsUsedPricePaidForLessonForTenant = (tenantId: number) => {
  return Query(
    `
  select price_paid_for_lesson
  from lessons_used
  where
  tenant_id=?;
  `,
    [tenantId]
  );
};

const getAllLessonsUsedPricePaidForLessonForTenantWithInDateRange = (
  tenantId: number,
  dateFrom: string,
  dateTo: string
) => {
  return Query(
    `
  select price_paid_for_lesson
  from lessons_used
  where
  tenant_id=?
  and (date_of_lesson >= ? and date_of_lesson <= ?);
  `,
    [tenantId, dateFrom, dateTo]
  );
};

let pricePaidForlessonAndPayoutPercentageOfAllTime = async (
  coachUserId: number
) => {
  return Query(
    `
  select lu.price_paid_for_lesson,
       p.payout_percentage_of_private_lessons
  from lessons_used lu
         join payout_percentages p on lu.payout_percentage_id = p.id
  where lu.coach_user_id = ?;
  `,
    [coachUserId]
  );
};

let pricePaidForlessonAndPayoutPercentageDateRange = async (
  coachUserId: number,
  dateFrom: string,
  dateTo: string
) => {
  return Query(
    `
  select lu.price_paid_for_lesson,
       p.payout_percentage_of_private_lessons
  from lessons_used lu
         join payout_percentages p on lu.payout_percentage_id = p.id
  where lu.coach_user_id = ?
  and (lu.date_of_lesson >= ? and lu.date_of_lesson <= ?);
  `,
    [coachUserId, dateFrom, dateTo]
  );
};

const getAllLessonsUsedPurchaseIdsByWreslterId = async (wrestlerId: number) => {
  return Query(
    `
  select purchase_id,
  date_of_lesson,
  time_of_lesson
  from lessons_used
  where wrestler_user_id = ?
  order by date_of_lesson desc , time_of_lesson;
  `,
    [wrestlerId]
  );
};

// POST
const checkInWrestlerForLesson = async (
  wrestlerUserId: number,
  coachUserId: number,
  checkedInByUserId: number,
  tenantId: number,
  payoutPercentageId: number,
  privateLessonBookingsId: number,
  purchaseId: number,
  pricePaidForLesson: number,
  dateOfLesson: string,
  timeOfLesson: string,
  checkInDateAndTime: number
) => {
  return Query(
    `
    insert into lessons_used 
    (
      wrestler_user_id, coach_user_id, checked_in_by_user_id, tenant_id, payout_percentage_id,
      private_lesson_bookings_id, purchase_id, price_paid_for_lesson, date_of_lesson,
      time_of_lesson, check_in_date_and_time
      )
    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
    [
      wrestlerUserId,
      coachUserId,
      checkedInByUserId,
      tenantId,
      payoutPercentageId,
      privateLessonBookingsId,
      purchaseId,
      pricePaidForLesson,
      dateOfLesson,
      timeOfLesson,
      checkInDateAndTime,
    ]
  );
};

// DELETE
const removeCheckInWrestlerForLesson = async (
  privateLessonBookingsId: number
) => {
  return Query(
    `
  delete from lessons_used
  where private_lesson_bookings_id=?;
  `,
    [privateLessonBookingsId]
  );
};

export default {
  // GET
  getPricePaidForLessonsAndCoachsPayoutPercentageForAllLessonsUsed,
  getAllCheckInsMadeByCoachId,
  getAmountOfLessonsUsed,
  getAlllessonsUsedByArrayOfPrivateLessonBookingsIds,
  getLessonUsedInfoByPrivateLessonBookingsId,
  getAllLessonsUsedForWrestlerId,
  getAllLessonsUsedPurchaseIdsForWreslterId,
  getAllLessonsUsedInMonthSelectedForWrestlerId,
  getAllLessonsUsedInDateRangeSelectedForCoachId,
  getAllLessonsUsedPricePaidForLessonForTenant,
  pricePaidForlessonAndPayoutPercentageOfAllTime,
  pricePaidForlessonAndPayoutPercentageDateRange,
  getAllLessonsUsedPurchaseIdsByWreslterId,
  getAllLessonsUsedPricePaidForLessonForTenantWithInDateRange,
  // POST
  checkInWrestlerForLesson,
  // DELETE
  removeCheckInWrestlerForLesson,
};
