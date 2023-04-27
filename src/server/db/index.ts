import * as mysql from "mysql";
import users from "./users";
import personal_info from "./personal_info";
import grades from "./grades";
import videos from "./videos";
import successful_logins from "./successful_logins";
import coaches_notes_for_wrestlers from "./coaches_notes_for_wrestlers";
import EarnableItemsQueries from "./EarnableItemsQueries";
import tenants from "./tenants";
import servicesAndMerchandise from "./servicesAndMerchandise";
import stripeAccounts from "./stripeAccounts";
import payments from "./payments";
import purchases from "./purchases";
import itemTypes from "./itemTypes";
import payoutPercentages from "./payoutPercentages";
import lessonsUsed from "./lessonsUsed";
import dateUnits from "./dateUnits";
import stripeCustomers from "./stripeCustomers";
import recurringPaymentContracts from "./recurringPaymentContracts";
import transactions from "./transactions";
import cronJobLogs from "./cronJobLogs";
import chats from "./chats";
import config from "../config";

export const Pool = mysql.createPool({
  connectionLimit: 10,
  host: config.db.host,
  port: Number(config.db.port),
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  timezone: "UTC",
});

export const Query = (
  query: string,
  values?: Array<string | number | null | Date | number[]>
) => {
  return new Promise<Array<any>>((resolve, reject) => {
    Pool.query(query, values, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

export default {
  users,
  personal_info,
  grades,
  videos,
  successful_logins,
  coaches_notes_for_wrestlers,
  EarnableItemsQueries,
  servicesAndMerchandise,
  stripeAccounts,
  tenants,
  itemTypes,
  payments,
  purchases,
  payoutPercentages,
  lessonsUsed,
  dateUnits,
  stripeCustomers,
  recurringPaymentContracts,
  transactions,
  cronJobLogs,
  chats,
};
