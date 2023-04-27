import * as React from "react";
import { useEffect, useState } from "react";
import { IAllCoachesAndAdminsByTenant } from "../ServicesForPrivateLessonScheduling/interfaces";
import CoachesPrivateLessonScheduleWeeklyCalendarHeader from "./CalendarComponents/CoachesPrivateLessonScheduleWeeklyCalendarHeader";
import AdminScheduleLessonForCoach from "./CalendarComponents/AdminScheduleLessonForCoach";

const ViewAllCoachesSchedules = (props: IProps) => {
  let [listOfAllByTenantCoaches, setListOfAllByTenantCoaches] =
    useState<Array<IAllCoachesAndAdminsByTenant>>();
  let [selectedCoachUID, setSelectedCoachUID] = useState<number>();
  let [selectedCoachName, setSelectedCoachName] =
    useState<string>("Select a coach");
  const [viewAllCoaches, setViewAllCoaches] = useState<boolean>(true);
  const [boolForRender, setBoolForRender] = useState<boolean>(false);

  useEffect(() => {
    fetch(
      `/api/schedulingLessons/getAllCoachesAndAdminsByTenant/${props.tenant}`
    )
      .then((res) => res.json())
      .then((res) => setListOfAllByTenantCoaches(res));
  }, [props.tenant]);

  let renderFuncFromViewCoachesSchedule = () => {
    setBoolForRender(!boolForRender);
  };

  return (
    <div>
      <div className="mt-3 mb-3 d-flex justify-content-center flex-wrap">
        <div className="text-center card col-12 col-md-11">
          {viewAllCoaches && (
            <div>
              <h5>
                <u>All coaches</u>
              </h5>
            </div>
          )}
          <div className="d-flex justify-content-center flex-wrap">
            <table className="table table-striped">
              <thead
                className="sticky-top"
                style={{
                  fontSize: ".7rem",
                  backgroundColor: "white",
                  zIndex: 10,
                }}
              >
                <tr>
                  <th>Coach</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {listOfAllByTenantCoaches?.map((coach) => {
                  if (viewAllCoaches || !selectedCoachUID) {
                    return (
                      <tr key={coach.user_id}>
                        <td className="pt-2 pb-2">
                          <button
                            onClick={() => {
                              setSelectedCoachName(
                                `${coach.first_name} ${coach.last_name}`
                              );
                              setSelectedCoachUID(coach.user_id);
                              setViewAllCoaches(false);
                            }}
                            style={{
                              color: "blue",
                              fontSize: ".7rem",
                            }}
                            className="btn btn-link p-0 text-left"
                          >
                            {coach.first_name} {coach.last_name}
                          </button>
                        </td>
                        <td className="pt-1 pb-1">
                          <span style={{ fontSize: ".7rem" }}>
                            {coach.phone_number}
                          </span>
                        </td>
                      </tr>
                    );
                  }
                  if (!viewAllCoaches && selectedCoachUID) {
                    if (coach.user_id == selectedCoachUID) {
                      return (
                        <tr key={coach.user_id}>
                          <td className="pt-1 pb-1">
                            <button
                              onClick={() => {
                                setSelectedCoachName(
                                  `${coach.first_name} ${coach.last_name}`
                                );
                                setSelectedCoachUID(coach.user_id);
                                setViewAllCoaches(false);
                              }}
                              style={{
                                color: "blue",
                                fontSize: ".7rem",
                              }}
                              className="btn btn-link p-0 text-left"
                            >
                              {coach.first_name} {coach.last_name}
                            </button>
                          </td>
                          <td className="pt-2 pb-2 ">
                            <span style={{ fontSize: ".7rem" }}>
                              {coach.phone_number}
                            </span>
                          </td>
                        </tr>
                      );
                    }
                  }
                })}
              </tbody>
            </table>
            {!viewAllCoaches && (
              <div>
                <span
                  className="btn-link"
                  onClick={() => setViewAllCoaches(true)}
                  style={{
                    color: "blue",
                    fontSize: ".8rem",
                    cursor: "pointer",
                  }}
                >
                  Show more
                </span>
              </div>
            )}
          </div>
        </div>
        {selectedCoachUID && selectedCoachName && props.role === "admin" && (
          <div className="col-12">
            <AdminScheduleLessonForCoach
              coachUserId={selectedCoachUID}
              coachName={selectedCoachName}
              funcFromStartPageToRenderComp={renderFuncFromViewCoachesSchedule}
            />
          </div>
        )}
      </div>
      <CoachesPrivateLessonScheduleWeeklyCalendarHeader
        role={props.role}
        coachesId={selectedCoachUID}
        coachesName={selectedCoachName}
        isAdminBool={false}
        isStripeAccountActive={props.isStripeAccountActive}
        propUsedOnlyForReRender={boolForRender}
      />
    </div>
  );
};

export default ViewAllCoachesSchedules;

interface IProps {
  tenant: string | any;
  role: string | undefined;
  isStripeAccountActive: boolean;
}
