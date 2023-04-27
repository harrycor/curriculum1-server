import Moment from "react-moment";
import * as React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

let ViewPlans = () => {
  let token = localStorage.getItem("token");
  let [allPlansArray, setAllPlansArray] = React.useState<Array<IAllPlans>>([]);
  let [role, setRole] = React.useState<string>("");
  let [tenantName, setTenantName] = React.useState<string>("");
  let [userId, setUserId] = React.useState<number>();

  let getAllPlansFunc = () => {
    fetch(`/api/lessonplans/validateToketLessonPlanCreate`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        setRole(res[0].role ? res[0].role : "no role");
        setTenantName(res[1][0].tenant_name ? res[1][0].tenant_name : "none");
        setUserId(res[0].userId ? res[0].userId : "no id");
        fetch(`/api/lessonplans/getAllLessonPlansForUser/${res[0].tenant}`) //
          .then((res) => res.json())
          .then((res) => setAllPlansArray(res));
      });
  };

  let handleDeleteButtonClick = (e: any) => {
    let confirmDelete = confirm("Are you sure you want to delete plan?");
    if (confirmDelete) {
      let lessonPlanId = e.target.value;
      fetch(`/api/lessonplans/deleteLessonPlan/${lessonPlanId}`, {
        method: "DELETE",
      }).then(() => getAllPlansFunc());
    } else {
      return;
    }
  };

  let htmlBasedOnRole = (planID: number, userID: number) => {
    if (role === "admin" || (role === "coach" && userID === userId)) {
      return (
        <td>
          <button
            className="btn btn-danger"
            value={planID}
            onClick={handleDeleteButtonClick}
          >
            Delete Plan
          </button>
          <Link className="btn btn-success" to={`/EditALessonPlan/${planID}`}>
            Edit Plan
          </Link>
        </td>
      );
    }
  };

  React.useEffect(() => {
    getAllPlansFunc();
  }, []);

  if (!allPlansArray[0]) {
    return (
      <div>
        <h1>No plans for {tenantName} ...</h1>
      </div>
    );
  }

  return (
    <div className="ml-3">
      <>
        <h1 className="mt-3">Lesson Plans for {tenantName}</h1>
        <div className="sticky-top bg-white"></div>
        <table className="table">
          <thead>
            <tr>
              <th>Lesson Plan</th>
              <th>Coach</th>
              <th>To be used on</th>
            </tr>
          </thead>
          <tbody>
            {allPlansArray.map((plan) => {
              return (
                <tr key={plan.id}>
                  <td>
                    <Link
                      to={`/PlayLessonPlan/${plan.id}`}
                      className="btn-link"
                    >
                      {plan.name_of_lesson_plan}
                    </Link>
                  </td>
                  <td>
                    {plan.coaches_FN} {plan.coaches_LN}
                  </td>
                  <td>
                    {moment(
                      plan.date_that_the_playlist_will_be_used_on.split("T")[0]
                    ).format("MMM, DD, YYYY")}
                    {/* <Moment fromNow>
                      {moment(
                        plan.date_that_the_playlist_will_be_used_on
                      ).format("MMMM, DD, YYYY")}
                    </Moment> */}
                  </td>
                  {htmlBasedOnRole(plan.id, plan.created_by)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    </div>
  );
};

export default ViewPlans;

export interface IAllPlans {
  id: number;
  name_of_lesson_plan: string;
  created_by: number;
  tenant: string;
  date_that_the_playlist_will_be_used_on: string;
  date_created: Date;
  coaches_FN: string;
  coaches_LN: string;
  tenant_name: string;
}
