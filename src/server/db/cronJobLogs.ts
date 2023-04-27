import { Query } from ".";

const selectAllCronJobLogs = () => {
  return Query(
    `
    select * from cron_job_logs
    `,
    []
  );
};

const insertNewCronJobLog = (
  numberOfContractsCharged: number,
  dateAndTimeOfCronJob: Date
) => {
  return Query(
    `
    insert into cron_job_logs(number_of_contracts_charged, date_and_time_of_cron_job)
values (?, ?);
    `,
    [numberOfContractsCharged, dateAndTimeOfCronJob]
  );
};

const deleteOldCronJobLogs = (todaysDate: Date) => {
  return Query(
    `delete
    from cron_job_logs
    where date_and_time_of_cron_job < ?;`,
    [todaysDate]
  );
};

export default {
  selectAllCronJobLogs,
  insertNewCronJobLog,
  deleteOldCronJobLogs,
};
