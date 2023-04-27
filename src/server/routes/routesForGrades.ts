import db from "../db";
import { Router } from "express";
import { hasValidCoachToken } from "../utils/tokenCheck";

const router = Router();

//I had to put these get requests above the one get request to "/:id?", because the url was being interpreted as a variable and running that request instead. Is this a good way to do this?
// Fuck no !!! Don't do this ... - WayneCarl Barkker

router.get("/allCurrentGradesForASingleWrestler/:user_id", async (req, res) => {
  let user_id = Number(req.params.user_id);
  try {
    res.json(await db.grades.allCurrentGradesForASingleWrestler(user_id));
  } catch (error) {
    console.log("error in /allCurrentGradesForASingleWrestler/:user_id");
    console.log(error);
    res.sendStatus(500);
  }
});

function getUserGrades(id: number):
  | Promise<{
      id: number;
      grades: Array<Record<string, any>>;
      show: true;
    }>
  | Error {
  if (id) {
    return new Promise(async (resolve, reject) => {
      try {
        let grades = await db.grades.allCurrentGradesForASingleWrestler(id);
        if (Array.isArray(grades) && grades.length && id) {
          // console.log({ grades });
          // console.log("heyo");
          resolve({ id, grades, show: true });
        } else {
          reject("Error fetching grades");
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    });
  } else {
    return new Error("There was no id provided");
  }
}

router.post("/multipleWrestlersGrades", async (req, res) => {
  let body = req.body;
  try {
    if (Object.keys(body.wrestlers).length == 0) {
      res.status(204).json([]);
    } else {
      let arrayOfIds: string[] = Object.keys(body.wrestlers);
      let arrayOfIdsNumber: number[] = arrayOfIds.map(Number);

      let test = arrayOfIdsNumber.map((id: number) => {
        let userAndGrades = getUserGrades(id);
        if (userAndGrades instanceof Error) {
          throw userAndGrades;
        } else {
          return userAndGrades;
        }
      });

      let finalArray = await Promise.all(test);

      res.status(200).json(finalArray);
    }
  } catch (error) {
    if ((error = "There was no id provided")) {
      res.sendStatus(204);
    } else {
      console.log(error);
      res.sendStatus(500);
    }
  }
});

// This is what a get request would look like for user_id=3, user_id=6 and grade=1: http://localhost:3000/api/grades/allSpecificCurrentGradesForTwoWrestlers/3&6&1
router.get(
  "/allSpecificCurrentGradesForTwoWrestlers/:wrestler1Id/:wrestler2Id/:grade",
  hasValidCoachToken,
  async (req, res) => {
    let wrestler1Id = Number(req.params.wrestler1Id);
    let wrestler2Id = Number(req.params.wrestler2Id);
    let grade = Number(req.params.grade);

    try {
      res.json(
        await db.grades.allSpecificCurrentGradesForTwoWrestlers(
          wrestler1Id,
          wrestler2Id,
          grade
        )
      );
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

// This is what a get request would look like for user_id=3 and grade=1: http://localhost:3000/api/grades/allSpecificCurrentGradesForASingleWrestler/3&1
router.get(
  "/allSpecificCurrentGradesForASingleWrestler/:user_id/:grade",
  async (req, res) => {
    //@ts-ignore
    let user_id = Number(req.params.user_id);
    //@ts-ignore
    let grade = Number(req.params.grade);
    try {
      res.json(
        await db.grades.allSpecificCurrentGradesForASingleWrestler(
          user_id,
          grade
        )
      );
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

// This is what a get request would look like for user_id=3 and level=1: http://localhost:3000/api/grades/gradesForSingleWreslterOnSpecificLevel/3&1
router.get(
  "/gradesForSingleWreslterOnSpecificLevel/:user_id/:level",
  async (req, res) => {
    //@ts-ignore
    let user_id = Number(req.params.user_id);
    //@ts-ignore
    let level = Number(req.params.level);
    try {
      res.json(
        await db.grades.gradesForSingleWreslterOnSpecificLevel(user_id, level)
      );
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

// This is what a get request would look like for user_id=3, user_id=6 and level=1: http://localhost:3000/api/grades/gradesForTwoWresltersOnASpecificLevel/3&6&1
router.get(
  "/gradesForTwoWresltersOnASpecificLevel/:wrestler1/:wrestler2/:level/:coachID",
  hasValidCoachToken,
  async (req, res) => {
    let wrestler1 = Number(req.params.wrestler1);
    let wrestler2 = Number(req.params.wrestler2);
    let level = Number(req.params.level);
    let coachID = Number(req.params.coachID);
    try {
      res.json(
        await db.grades.gradesForTwoWresltersOnASpecificLevel(
          wrestler1,
          wrestler2,
          level,
          coachID
        )
      );
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/gradesForTwoWresltersOnAllLevels/:wrestler1/:wrestler2/:coachUID",
  hasValidCoachToken,
  async (req, res) => {
    let wrestler1 = Number(req.params.wrestler1);
    let wrestler2 = Number(req.params.wrestler2);
    let coachUID = Number(req.params.coachUID);
    try {
      res.json(
        await db.grades.gradesForTwoWresltersOnAllLevels(
          wrestler1,
          wrestler2,
          coachUID
        )
      );
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.get(
  "/allGradesForTwoWrestlers/:wrestler1/:wrestler2",
  hasValidCoachToken,
  async (req, res) => {
    let wrestler1 = Number(req.params.wrestler1);
    let wrestler2 = Number(req.params.wrestler2);
    try {
      res.json(await db.grades.allGradesForTwoWreslters(wrestler1, wrestler2));
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.get("/:id?", async (req, res) => {
  let id = Number(req.params.id);
  try {
    if (id) {
      res.json(await db.grades.singleGrade(id));
    } else {
      res.json(await db.grades.all());
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post(
  "/getAllGradesForSelectedWrestlers",
  hasValidCoachToken,
  async (req, res) => {
    let allWrestlerIds = req.body.allWrestlerIds;
    let videoId = req.body.videoId;

    try {
      res.json(
        await db.grades.getGradesForMultipleWrestlers(videoId, allWrestlerIds)
      );
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

router.post("/", async (req, res) => {
  try {
    res.json(await db.grades.createGrade(req.body));
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

router.put("/", hasValidCoachToken, async (req, res) => {
  try {
    res.json(await db.grades.updateGrade(req.body));
  } catch (error) {
    console.log(error);
    console.log("somethings messed up here");
    res.sendStatus(500);
  }
});

router.delete("/:id", hasValidCoachToken, async (req, res) => {
  let id = Number(req.params.id);
  try {
    res.json(await db.grades.deleteGrade(id));
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

export default router;
