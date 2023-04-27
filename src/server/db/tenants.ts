import { Query } from "./index";
import { IPerson } from "../../types";

const createNewTenant = async (tenantName: string) => {
  return Query(
    `
    INSERT into tenants (tenant_name)
        values (?);
    `,
    [tenantName]
  );
};

const getTenantName = async(tenantId: number) => {
  return Query(
    `
  select tenant_name from tenants
  where id=?;
  `,
    [tenantId]
  );
};

export default {
  createNewTenant,
  getTenantName,
};
