import { Query } from ".";

// GET
const getAllCoachsUserInformationWithPayoutPercentages = async (
  tenantId: number
) => {
  return Query(
    `
    select u.id,
    u.email,
    u.role,
    u.real_email,
    u.tenant,
    u.is_active,
    pi.first_name,
    pi.last_name,
    pp.id as payout_percentage_id,
    pp.payout_percentage_of_private_lessons
from users u
left join personal_info pi on u.id = pi.user_id
left join (select p1.*
        from payout_percentages p1
                 join (select user_id, MAX(date_created) as date_created
                       from payout_percentages
                       group by user_id) as p2
                      on p1.user_id = p2.user_id and p1.date_created = p2.date_created) pp
       on u.id = pp.user_id
where u.tenant = ?
and (u.role = "coach" or u.role = "admin");
    `,
    [tenantId]
  );
};

const getCurrentPayoutPercentageForCoachsId = async (userId: number) => {
  return Query(
    `
  select id, payout_percentage_of_private_lessons
    from payout_percentages
    where user_id = ?
    order by date_created desc
    limit 1;
  `,
    [userId]
  );
};

// POST
const createNewPayoutPercentage = async (
  coachsUserId: number,
  payoutPercentageOfPrivateLessons: number,
  tenantId: number,
  createdByUserId: number
) => {
  return Query(
    `
  insert into payout_percentages(user_id, payout_percentage_of_private_lessons, tenant_id, created_by_user_id)
    values (?, ?, ?, ?)`,
    [coachsUserId, payoutPercentageOfPrivateLessons, tenantId, createdByUserId]
  );
};

// PUT
const updatePayoutPercentage = async (
  newPayoutPercentage: number,
  payoutPercentageId: number
) => {
  return Query(
    `
  update payout_percentages
    set payout_percentage_of_private_lessons = ?
    where id = ?;
  `,
    [newPayoutPercentage, payoutPercentageId]
  );
};

export default {
  // GET
  getAllCoachsUserInformationWithPayoutPercentages,
  getCurrentPayoutPercentageForCoachsId,
  // POST
  createNewPayoutPercentage,
  // PUT
  updatePayoutPercentage,
};

// select
// u.id,
// u.email,
// u.role,
// u.real_email,
// u.tenant,
// u.is_active,
// pi.first_name,
// pi.last_name,
// pp.id as payout_percentage_id,
// pp.payout_percentage_of_private_lessons
// from users u
// left join personal_info pi on u.id = pi.user_id
// left join (select * from payout_percentages order by date_created desc limit 1) as pp
// on u.id = pp.user_id
// where u.tenant=? and (u.role="coach" or u.role="admin");
