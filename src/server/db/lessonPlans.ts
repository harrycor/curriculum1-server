import { Query } from "./index";
import { IGrade } from "../../types";

//  GETs
const getPlanInfo = async (planId: any) => {
  return await Query("select * from lesson_plans where id = ?", [planId]);
};

const getAllLessonPlansForUser = async (tenant: string) => {
  return await Query(
    `
    SELECT
    lp.id,
    lp.name_of_lesson_plan,
    lp.created_by,
    lp.tenant,
    lp.date_that_the_playlist_will_be_used_on,
    lp.date_created,
    pi.first_name as coaches_FN,
    pi.last_name as coaches_LN,
    t.tenant_name
    from lesson_plans lp
    join personal_info pi on lp.created_by = pi.user_id
    join tenants t on lp.tenant = t.id
    where lp.tenant = ?
    ORDER BY lp.date_that_the_playlist_will_be_used_on DESC;
    `,
    [tenant]
  );
};

const getAllVideosInLessonPlan = async (lessonPlanId: any) => {
  return await Query(
    `
  select 
  lp.id as lpID,
  lp.name_of_lesson_plan as planName,
  lp.created_by as createdBy,
  lpv.id as lpvID,
  lpv.duration_to_display_video_in_seconds as lengthToDisplay,
  lpv.number_for_ordering as orderNumber,
  v.id as videoID,
  v.tenant as tenant,
  v.name_of_video as videoName,
  v.url_to_video as videoURL,
  v.url_to_looped_video as loopedVideoURL
  from lesson_plans lp
  join lesson_plan_videos lpv on lp.id = lpv.lesson_plan_id
  join videos v on lpv.video_id = v.id
  where lp.id = ?
  order by orderNumber;
  `,
    [lessonPlanId]
  );
};

const getAllVideosByTenant = async (tenant: string) => {
  return await Query("SELECT * FROM videos where tenant = ?", [tenant]);
};

//  POSTs
const addNewPlanToDB = async (
  planName: string,
  dateThatThePlaylistWillBeUsedOn: string,
  userId: number,
  tenant: string
) => {
  return await Query(
    "INSERT INTO lesson_plans(name_of_lesson_plan, date_that_the_playlist_will_be_used_on, created_by, tenant) VALUES (?, ?, ?, ?)",
    [planName, dateThatThePlaylistWillBeUsedOn, userId, tenant]
  );
};

const addNewVideoToLessonPlan = async (
  // durationOfVideo: number,
  planId: number,
  videoId: number,
  oderOfVideo: number
) => {
  return await Query(
    "INSERT INTO lesson_plan_videos (lesson_plan_id, video_id, number_for_ordering) VALUES (?, ?, ?)",
    [planId, videoId, oderOfVideo]
  );
};

//   PUTS
const putNewLessonPlanName = async (
  newLessonPlanName: string,
  date_that_the_playlist_will_be_used_on: string,
  planId: string | number
) => {
  return await Query(
    `
  UPDATE lesson_plans SET name_of_lesson_plan = ?, date_that_the_playlist_will_be_used_on=? where id = ?;
  `,
    [newLessonPlanName, date_that_the_playlist_will_be_used_on, planId]
  );
};

//  DELETEs
const deleteSingleVideoFromLessonPlan = async (lessonPlanVideosId: any) => {
  return await Query("delete from lesson_plan_videos where id = ?", [
    lessonPlanVideosId,
  ]);
};

const deleteAllVideoInLessonPlan = async (lessonPlanId: any) => {
  return await Query(
    "delete from lesson_plan_videos where lesson_plan_id = ?",
    [lessonPlanId]
  );
};
const deleteLessonPlan = async (lessonPlanId: any) => {
  return await Query("delete from lesson_plans where id = ?", [lessonPlanId]);
};

const deleteAllVideosByVideoId = async (videoId: number) => {
  return await Query(`delete from lesson_plan_videos where video_id=?`, [
    videoId,
  ]);
};

export default {
  //GETs
  getPlanInfo,
  getAllLessonPlansForUser,
  getAllVideosByTenant,
  getAllVideosInLessonPlan,
  //POSTs
  addNewPlanToDB,
  addNewVideoToLessonPlan,
  putNewLessonPlanName,
  //DELETEs
  deleteSingleVideoFromLessonPlan,
  deleteAllVideoInLessonPlan,
  deleteLessonPlan,
  deleteAllVideosByVideoId,
};
