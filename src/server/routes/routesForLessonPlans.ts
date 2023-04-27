import db, { Query } from "../db";
import lessonPlans from "../db/lessonPlans";
import { Router } from "express";
import { hasValidCoachToken } from "../utils/tokenCheck";
import { verify, decode } from "jsonwebtoken";
import config from "../config";
import * as moment from "moment";

const router = Router();

//      GETS
router.get("/getLessonPlanInfo/:planId", async (req, res) => {
  try {
    let planId = req.params.planId;
    let planInfo = await lessonPlans.getPlanInfo(planId);
    res.json(planInfo);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get("/getAllLessonPlansForUser/:tenant", async (req, res) => {
  try {
    let tenant = req.params.tenant;
    let allPlansForUser = await lessonPlans.getAllLessonPlansForUser(tenant);
    res.json(allPlansForUser);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get(`/getAllVideosInPlan/:planId`, async (req, res) => {
  try {
    let planId = req.params.planId;
    let lessonPlanVideos = await lessonPlans.getAllVideosInLessonPlan(planId);
    res.json(lessonPlanVideos);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get("/getAllVideosByTenant/:tenant", async (req, res) => {
  try {
    let tenant = req.params.tenant;
    let allVideosByTenant = await lessonPlans.getAllVideosByTenant(tenant);
    res.json(allVideosByTenant);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.get("/validateToketLessonPlanCreate", async (req, res) => {
  // this return info provided in token
  try {
    let token: any = req.headers.authorization?.split(" ")[1]; //removes bearer from the string
    let isValidToken: any = verify(token, config.jwt.secret);
    let tenantName = await db.tenants.getTenantName(isValidToken.tenant);
    // console.log(tenantName);
    // console.log(isValidToken);
    // console.log(isValidToken, tenantName)
    res.json([isValidToken, tenantName]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//      POSTS
router.post("/addNewLessonPlan", async (req, res) => {
  try {
    let planName = req.body.planName;
    let dateThatThePlaylistWillBeUsedOn =
      req.body.dateThatThePlaylistWillBeUsedOn;
    let userId = req.body.userId;
    let tenant = req.body.tenant;
    await lessonPlans.addNewPlanToDB(
      planName,
      dateThatThePlaylistWillBeUsedOn,
      userId,
      tenant
    );
    res.status(200).json({ message: "Your plan has been added!" });
    // res.json({userId, planName})
  } catch (error) {
    console.log(error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(500).json({ message: "Plan name already exists" });
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.post(`/addNewVideoToLessonPlan`, async (req, res) => {
  try {
    // let durationOfVideo = req.body.durationOfVideo;
    let planId = req.body.planId;
    let videoId = req.body.videoId;
    let oderOfVideo = req.body.orderVideo;
    await lessonPlans.addNewVideoToLessonPlan(
      planId,
      videoId,
      // durationOfVideo,
      oderOfVideo
    );
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//  PUTS
router.put("/putLessonPlanNewName", async (req, res) => {
  try {
    let newLessonPlanName = req.body.newLessonPlanName;
    let dateThatThePlaylistWillBeUsedOn =
      req.body.dateThatThePlaylistWillBeUsedOn;
    let planId = req.body.planId;
    await lessonPlans.putNewLessonPlanName(
      newLessonPlanName,
      dateThatThePlaylistWillBeUsedOn,
      planId
    );
    res.status(200).json({
      message: `Your new lesson plan name is, ${newLessonPlanName}, and is ready to be used on, ${moment(
        dateThatThePlaylistWillBeUsedOn
      ).format("MMMM, DD, YYYY")}`,
    });
  } catch (error) {
    console.log(error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(500).json({ message: "Plan name already exists" });
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
});

//    DELETEs
router.delete(
  `/deleteSingleVideoFromLessonPlan/:lessonPlanVideosID`,
  async (req, res) => {
    try {
      let lessonPlanVideosId: any = req.params.lessonPlanVideosID;
      await lessonPlans.deleteSingleVideoFromLessonPlan(lessonPlanVideosId);
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.delete(`/deleteLessonPlan/:lessonPlanId`, async (req, res) => {
  try {
    let lessonPlanId = req.params.lessonPlanId;
    await lessonPlans.deleteAllVideoInLessonPlan(lessonPlanId);
    await lessonPlans.deleteLessonPlan(lessonPlanId);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

export default router;
