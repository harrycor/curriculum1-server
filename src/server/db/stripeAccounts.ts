import { Query } from "./index";

// GET
const getStripeAccountInfoByTenantId = async (tenantId: number) => {
  return Query(
    `
    select * from stripe_accounts where tenant_id=?
    `,
    [tenantId]
  );
};

// POST
const createStripeAccount = async (
  tenantId: number,
  createdByUserId: number,
  stripeAccountId: string,
  stripeAccountType: string
) => {
  return Query(
    `
  insert into stripe_accounts(tenant_id, created_by_user_id, stripe_account_id, stripe_account_type)
  values (?,?,?,?);`,
    [tenantId, createdByUserId, stripeAccountId, stripeAccountType]
  );
};

export default {
  // GET
  getStripeAccountInfoByTenantId,
  // POST
  createStripeAccount,
};
