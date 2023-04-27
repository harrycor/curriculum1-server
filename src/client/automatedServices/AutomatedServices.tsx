import moment from "moment";
import * as React from "react";
import { useState, useEffect } from "react";
import { ICronJobLog } from "../../types";
import NavigationBar from "../NavigationBar";

const AutomatedServices = () => {
  const [cronJobsFromCronJobManager, setCronJobsFromCronJobManager] =
    useState<any>();
  const [allCronJobLogs, setAllCronJobLogs] = useState<ICronJobLog[]>();
  const [renderBool, setRenderBool] = useState<boolean>(false);
  let token = localStorage.getItem("token");

  let reqOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    let isMounted = true;
    fetch("/api/cronJobs/getAllCronJobsFromCronJobManager", reqOptions)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setCronJobsFromCronJobManager(res.allCronJobsInManager);
        setAllCronJobLogs(res.allCronJobLogs);
      })
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, [renderBool]);

  let handleCreateCronJob = () => {
    fetch("/api/cronJobs/createCronJob", reqOptions)
      .then((res) => res.json())
      .then((res) => {
        alert(res.message);
        renderFunc();
      })
      .catch((err) => console.log(err));
  };

  let handleStartCronJob = () => {
    fetch(
      "/api/cronJobs/startRecurringPaymentContractStatusCheckCronJob",
      reqOptions
    )
      .then((res) => res.json())
      .then((res) => {
        alert(res.message);
        renderFunc();
      })
      .catch((err) => console.log(err));
  };

  let handleStopCronJob = () => {
    fetch(
      "/api/cronJobs/stopRecurringPaymentContractStatusCheckCronJob",
      reqOptions
    )
      .then((res) => res.json())
      .then((res) => {
        alert(res.message);
        renderFunc();
      })
      .catch((err) => console.log(err));
  };

  let handleDeleteCronJob = () => {
    fetch("/api/cronJobs/deleteAllCronJobs", reqOptions)
      .then((res) => res.json())
      .then((res) => {
        alert(res.message);
        renderFunc();
      })
      .catch((err) => console.log(err));
  };

  let renderFunc = () => setRenderBool(!renderBool);

  return (
    <div>
      <NavigationBar />
      <div className="d-flex justify-content-center flex-wrap">
        <h3>Cron jobs</h3>
        <div style={{ fontSize: ".7rem" }} className="col-12 text-center ">
          <button
            onClick={handleCreateCronJob}
            className="btn btn-sm btn-success m-1"
          >
            Create recurring payment contracts cron job
          </button>
          <br />
          <button
            onClick={handleStartCronJob}
            className="btn btn-sm btn-success m-1"
          >
            Start recurring payment contracts cron job
          </button>
          <br />
          <button
            onClick={handleStopCronJob}
            className="btn btn-sm btn-success m-1"
          >
            stop recurring payment contracts cron job
          </button>
          <br />
          <button
            onClick={handleDeleteCronJob}
            className="btn btn-sm btn-danger m-1"
          >
            Delete all cron jobs
          </button>
        </div>
        <div className="text-center" style={{ fontSize: ".6rem" }}>
          <span>
            If the box below is empty there are currently no cron jobs that
            exist
          </span>
          <br />
          <span
            style={{ border: "solid black 1px" }}
            className="col-10 col-md-6 text-center"
          >
            {cronJobsFromCronJobManager}
          </span>
        </div>
      </div>
      <div className="col-12 d-flex justify-content-center">
        <div className="col-md-6 col-12">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Number of contracts charged</th>
                <th>Date and time of cron job</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: ".7rem" }}>
              {allCronJobLogs?.map((cronJob) => {
                return (
                  <tr key={cronJob.id}>
                    <td>{cronJob.id}</td>
                    <td>{cronJob.number_of_contracts_charged}</td>
                    <td>
                      {moment(cronJob.date_and_time_of_cron_job).format(
                        "MMM DD, YYYY - h:mm a"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AutomatedServices;
